const express = require('express');
const router = express.Router();
const Ground = require('../models/Ground');
const Session = require('../models/Session');

// @route   GET /api/grounds
// @desc    Get all grounds
// @access  Public
router.get('/', async (req, res) => {
  try {
    const grounds = await Ground.find();
    res.json({
      success: true,
      data: grounds
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching grounds',
      error: error.message
    });
  }
});

// @route   GET /api/grounds/:id
// @desc    Get ground by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const ground = await Ground.findById(req.params.id);
    if (!ground) {
      return res.status(404).json({
        success: false,
        message: 'Ground not found'
      });
    }
    res.json({
      success: true,
      data: ground
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ground',
      error: error.message
    });
  }
});

// @route   POST /api/grounds
// @desc    Create new ground
// @access  Private (Ground Manager only)
router.post('/', async (req, res) => {
  try {
    const { pricePerSlot, description, groundSlot, maxSlotPerDay } = req.body;
    
    const ground = new Ground({
      pricePerSlot,
      description,
      groundSlot,
      maxSlotPerDay
    });

    await ground.save();
    res.status(201).json({
      success: true,
      message: 'Ground created successfully',
      data: ground
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating ground',
      error: error.message
    });
  }
});

// @route   PUT /api/grounds/:id
// @desc    Update ground
// @access  Private (Ground Manager only)
router.put('/:id', async (req, res) => {
  try {
    const ground = await Ground.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!ground) {
      return res.status(404).json({
        success: false,
        message: 'Ground not found'
      });
    }

    res.json({
      success: true,
      message: 'Ground updated successfully',
      data: ground
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating ground',
      error: error.message
    });
  }
});

// @route   DELETE /api/grounds/:id
// @desc    Delete ground
// @access  Private (Ground Manager only)
router.delete('/:id', async (req, res) => {
  try {
    // Check if ground has any sessions
    const sessions = await Session.countDocuments({ ground: req.params.id });
    if (sessions > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete ground with existing sessions'
      });
    }

    const ground = await Ground.findByIdAndDelete(req.params.id);
    if (!ground) {
      return res.status(404).json({
        success: false,
        message: 'Ground not found'
      });
    }

    res.json({
      success: true,
      message: 'Ground deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting ground',
      error: error.message
    });
  }
});

// @route   GET /api/grounds/:id/availability
// @desc    Get ground availability for a date
// @access  Public
router.get('/:id/availability', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date parameter is required'
      });
    }

    const ground = await Ground.findById(req.params.id);
    if (!ground) {
      return res.status(404).json({
        success: false,
        message: 'Ground not found'
      });
    }

    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    // Get all booked sessions for the date
    const bookedSessions = await Session.find({
      ground: req.params.id,
      scheduledDate: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $nin: ['cancelled'] }
    }).select('groundSlot startTime endTime');

    // Calculate availability
    const availability = [];
    for (let slot = 1; slot <= ground.groundSlot; slot++) {
      const slotBookings = bookedSessions.filter(session => session.groundSlot === slot);
      availability.push({
        slot,
        bookings: slotBookings,
        isAvailable: slotBookings.length < ground.maxSlotPerDay
      });
    }

    res.json({
      success: true,
      data: {
        ground,
        date,
        availability
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ground availability',
      error: error.message
    });
  }
});

module.exports = router;
