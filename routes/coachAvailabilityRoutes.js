const express = require('express');
const router = express.Router();
const Coach = require('../models/Coach');

// @route   GET /api/coach-availability/:coachId
// @desc    Get coach availability
// @access  Public
router.get('/:coachId', async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.coachId)
      .select('availability isActive')
      .populate('userId', 'firstName lastName');

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    if (!coach.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Coach is not active'
      });
    }

    res.json({
      success: true,
      data: {
        coachId: coach._id,
        coachName: `${coach.userId.firstName} ${coach.userId.lastName}`,
        availability: coach.availability
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching coach availability',
      error: error.message
    });
  }
});

// @route   PUT /api/coach-availability/:coachId
// @desc    Update coach availability
// @access  Private (Coach themselves)
router.put('/:coachId', async (req, res) => {
  try {
    const { availability } = req.body;

    if (!Array.isArray(availability)) {
      return res.status(400).json({
        success: false,
        message: 'Availability must be an array'
      });
    }

    // Validate availability format
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    for (const slot of availability) {
      if (!validDays.includes(slot.dayOfWeek)) {
        return res.status(400).json({
          success: false,
          message: `Invalid day of week: ${slot.dayOfWeek}`
        });
      }

      // Validate time format (HH:MM)
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(slot.startTime) || !timeRegex.test(slot.endTime)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid time format. Use HH:MM format'
        });
      }

      // Check if start time is before end time
      const start = new Date(`2000-01-01T${slot.startTime}:00`);
      const end = new Date(`2000-01-01T${slot.endTime}:00`);
      if (start >= end) {
        return res.status(400).json({
          success: false,
          message: 'Start time must be before end time'
        });
      }
    }

    const coach = await Coach.findByIdAndUpdate(
      req.params.coachId,
      { availability },
      { new: true, runValidators: true }
    ).populate('userId', 'firstName lastName');

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    res.json({
      success: true,
      message: 'Availability updated successfully',
      data: {
        coachId: coach._id,
        coachName: `${coach.userId.firstName} ${coach.userId.lastName}`,
        availability: coach.availability
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating availability',
      error: error.message
    });
  }
});

// @route   GET /api/coach-availability
// @desc    Get all active coaches availability
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { dayOfWeek, specialization } = req.query;

    const filter = { isActive: true };
    if (specialization) {
      filter.specializations = { $in: [specialization] };
    }

    let coaches = await Coach.find(filter)
      .select('availability specializations rating')
      .populate('userId', 'firstName lastName');

    // Filter by day of week if specified
    if (dayOfWeek) {
      coaches = coaches.filter(coach => 
        coach.availability.some(slot => slot.dayOfWeek === dayOfWeek)
      );
    }

    const availabilityData = coaches.map(coach => ({
      coachId: coach._id,
      coachName: `${coach.userId.firstName} ${coach.userId.lastName}`,
      specializations: coach.specializations,
      rating: coach.rating,
      availability: dayOfWeek 
        ? coach.availability.filter(slot => slot.dayOfWeek === dayOfWeek)
        : coach.availability
    }));

    res.json({
      success: true,
      data: availabilityData,
      count: availabilityData.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching coaches availability',
      error: error.message
    });
  }
});

// @route   POST /api/coach-availability/:coachId/check-conflict
// @desc    Check if coach is available for a specific time slot
// @access  Public
router.post('/:coachId/check-conflict', async (req, res) => {
  try {
    const { dayOfWeek, startTime, endTime } = req.body;

    const coach = await Coach.findById(req.params.coachId)
      .select('availability isActive');

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    if (!coach.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Coach is not active'
      });
    }

    // Check if coach is available on the specified day and time
    const availableSlots = coach.availability.filter(slot => 
      slot.dayOfWeek === dayOfWeek
    );

    let isAvailable = false;
    const conflictingSlots = [];

    for (const slot of availableSlots) {
      const slotStart = new Date(`2000-01-01T${slot.startTime}:00`);
      const slotEnd = new Date(`2000-01-01T${slot.endTime}:00`);
      const requestStart = new Date(`2000-01-01T${startTime}:00`);
      const requestEnd = new Date(`2000-01-01T${endTime}:00`);

      // Check if the requested time falls within the coach's available time
      if (requestStart >= slotStart && requestEnd <= slotEnd) {
        isAvailable = true;
        break;
      }

      // Check for partial overlaps (conflicts)
      if (
        (requestStart >= slotStart && requestStart < slotEnd) ||
        (requestEnd > slotStart && requestEnd <= slotEnd) ||
        (requestStart <= slotStart && requestEnd >= slotEnd)
      ) {
        conflictingSlots.push(slot);
      }
    }

    res.json({
      success: true,
      data: {
        isAvailable,
        hasConflicts: conflictingSlots.length > 0,
        conflictingSlots,
        availableSlots: availableSlots
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking availability conflict',
      error: error.message
    });
  }
});

module.exports = router;
