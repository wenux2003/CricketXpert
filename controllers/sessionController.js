const Session = require('../models/Session');
const Enrollment = require('../models/Enrollment');
const Ground = require('../models/Ground');
const CoachingProgram = require('../models/CoachingProgram');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

// Get all sessions with filters
const getAllSessions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      coach,
      program,
      ground,
      status,
      date,
      userId
    } = req.query;

    // Build filter object
    const filter = {};
    if (coach) filter.coach = coach;
    if (program) filter.program = program;
    if (ground) filter.ground = ground;
    if (status) filter.status = status;
    
    // Filter by date range
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.scheduledDate = {
        $gte: startDate,
        $lt: endDate
      };
    }

    // If userId is provided, filter sessions where user is enrolled
    let sessionQuery = Session.find(filter);

    if (userId) {
      // Get user's enrollments first
      const userEnrollments = await Enrollment.find({
        user: userId,
        status: { $in: ['active', 'pending'] }
      }).select('program');

      const programIds = userEnrollments.map(enrollment => enrollment.program);
      filter.program = { $in: programIds };
    }

    const sessions = await Session.find(filter)
      .populate({
        path: 'coach',
        populate: {
          path: 'userId',
          select: 'firstName lastName'
        }
      })
      .populate('program', 'title category')
      .populate('ground', 'description')
      .populate('participants.user', 'firstName lastName')
      .sort({ scheduledDate: 1, startTime: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalSessions = await Session.countDocuments(filter);

    res.json({
      success: true,
      data: sessions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalSessions / parseInt(limit)),
        totalSessions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sessions',
      error: error.message
    });
  }
};

// Get session by ID
const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate({
        path: 'coach',
        populate: {
          path: 'userId',
          select: 'firstName lastName email contactNumber'
        }
      })
      .populate('program', 'title description category')
      .populate('ground', 'description pricePerSlot')
      .populate({
        path: 'participants.user',
        select: 'firstName lastName email'
      })
      .populate({
        path: 'participants.enrollment',
        select: 'enrollmentDate progress'
      });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching session',
      error: error.message
    });
  }
};

// Create new session
const createSession = async (req, res) => {
  try {
    const {
      programId,
      coachId,
      title,
      description,
      sessionNumber,
      week,
      scheduledDate,
      startTime,
      endTime,
      duration,
      groundId,
      groundSlot,
      objectives,
      materials,
      maxParticipants
    } = req.body;

    // Check if ground slot is available
    const isSlotAvailable = await Session.isSlotAvailable(
      groundId,
      groundSlot,
      new Date(scheduledDate),
      startTime,
      endTime
    );

    if (!isSlotAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Ground slot is not available for the specified time'
      });
    }

    // Verify ground exists and has the requested slot
    const ground = await Ground.findById(groundId);
    if (!ground) {
      return res.status(404).json({
        success: false,
        message: 'Ground not found'
      });
    }

    if (groundSlot > ground.groundSlot) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ground slot number'
      });
    }

    // Create session
    const session = new Session({
      program: programId,
      coach: coachId,
      title,
      description,
      sessionNumber,
      week,
      scheduledDate,
      startTime,
      endTime,
      duration,
      ground: groundId,
      groundSlot,
      objectives: objectives || [],
      materials: materials || [],
      maxParticipants: maxParticipants || 10
    });

    await session.save();

    // Populate session data for response
    await session.populate([
      {
        path: 'coach',
        populate: {
          path: 'userId',
          select: 'firstName lastName'
        }
      },
      { path: 'program', select: 'title' },
      { path: 'ground', select: 'description' }
    ]);

    // Notify enrolled students about new session
    const enrollments = await Enrollment.find({
      program: programId,
      status: 'active'
    });

    for (const enrollment of enrollments) {
      await Notification.createNotification({
        recipient: enrollment.user,
        title: 'New Session Scheduled',
        message: `A new session "${title}" has been scheduled for ${new Date(scheduledDate).toDateString()}`,
        type: 'session_scheduled',
        category: 'info',
        relatedModel: 'Session',
        relatedId: session._id,
        actionUrl: `/sessions/${session._id}`,
        deliveryChannels: [{ channel: 'in_app' }]
      });
    }

    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating session',
      error: error.message
    });
  }
};

// Book session for user
const bookSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.body;

    const session = await Session.findById(sessionId)
      .populate('program');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check if session can be booked
    if (!session.canBook) {
      return res.status(400).json({
        success: false,
        message: 'Session cannot be booked (full, past deadline, or cancelled)'
      });
    }

    // Check if user is enrolled in the program
    const enrollment = await Enrollment.findOne({
      user: userId,
      program: session.program._id,
      status: 'active'
    });

    if (!enrollment) {
      return res.status(400).json({
        success: false,
        message: 'User is not enrolled in this program'
      });
    }

    // Check if user is already registered for this session
    const isAlreadyRegistered = session.participants.some(
      participant => participant.user.toString() === userId
    );

    if (isAlreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: 'User is already registered for this session'
      });
    }

    // Add user to session participants
    session.participants.push({
      user: userId,
      enrollment: enrollment._id
    });

    await session.save();

    // Add session to enrollment
    if (!enrollment.sessions.includes(sessionId)) {
      enrollment.sessions.push(sessionId);
      await enrollment.save();
    }

    // Send notifications
    await Notification.createNotification({
      recipient: userId,
      title: 'Session Booked',
      message: `You have successfully booked "${session.title}" scheduled for ${new Date(session.scheduledDate).toDateString()}`,
      type: 'session_scheduled',
      category: 'success',
      relatedModel: 'Session',
      relatedId: session._id,
      actionUrl: `/sessions/${session._id}`,
      deliveryChannels: [{ channel: 'in_app' }]
    });

    // Notify coach
    const coach = await session.populate({
      path: 'coach',
      populate: {
        path: 'userId'
      }
    });

    await Notification.createNotification({
      recipient: coach.coach.userId._id,
      title: 'New Session Booking',
      message: `A student has booked your session "${session.title}"`,
      type: 'session_scheduled',
      category: 'info',
      relatedModel: 'Session',
      relatedId: session._id,
      deliveryChannels: [{ channel: 'in_app' }]
    });

    res.json({
      success: true,
      message: 'Session booked successfully',
      data: {
        sessionId: session._id,
        availableSpots: session.availableSpots
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error booking session',
      error: error.message
    });
  }
};

// Cancel session booking
const cancelBooking = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check if session is too close to start time
    const now = new Date();
    const sessionStart = new Date(session.scheduledDate);
    const [hours, minutes] = session.startTime.split(':').map(Number);
    sessionStart.setHours(hours, minutes, 0, 0);

    if (now > session.bookingDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking - too close to session start time'
      });
    }

    // Remove user from participants
    const participantIndex = session.participants.findIndex(
      participant => participant.user.toString() === userId
    );

    if (participantIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'User is not registered for this session'
      });
    }

    session.participants.splice(participantIndex, 1);
    await session.save();

    // Remove session from user's enrollment
    const enrollment = await Enrollment.findOne({
      user: userId,
      program: session.program,
      status: 'active'
    });

    if (enrollment) {
      enrollment.sessions.pull(sessionId);
      await enrollment.save();
    }

    // Send notification
    await Notification.createNotification({
      recipient: userId,
      title: 'Session Booking Cancelled',
      message: `Your booking for "${session.title}" has been cancelled`,
      type: 'session_cancelled',
      category: 'info',
      relatedModel: 'Session',
      relatedId: session._id,
      deliveryChannels: [{ channel: 'in_app' }]
    });

    res.json({
      success: true,
      message: 'Session booking cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
};

// Update session
const updateSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const updateData = req.body;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // If rescheduling, check ground slot availability
    if (updateData.scheduledDate || updateData.startTime || updateData.endTime || updateData.groundSlot) {
      const checkDate = new Date(updateData.scheduledDate || session.scheduledDate);
      const checkStartTime = updateData.startTime || session.startTime;
      const checkEndTime = updateData.endTime || session.endTime;
      const checkGroundId = updateData.ground || session.ground;
      const checkGroundSlot = updateData.groundSlot || session.groundSlot;

      const isSlotAvailable = await Session.isSlotAvailable(
        checkGroundId,
        checkGroundSlot,
        checkDate,
        checkStartTime,
        checkEndTime,
        sessionId
      );

      if (!isSlotAvailable) {
        return res.status(400).json({
          success: false,
          message: 'Ground slot is not available for the specified time'
        });
      }
    }

    const updatedSession = await Session.findByIdAndUpdate(
      sessionId,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      {
        path: 'coach',
        populate: {
          path: 'userId',
          select: 'firstName lastName'
        }
      },
      { path: 'program', select: 'title' },
      { path: 'ground', select: 'description' }
    ]);

    // If session was rescheduled, notify participants
    if (updateData.scheduledDate || updateData.startTime) {
      for (const participant of session.participants) {
        await Notification.createNotification({
          recipient: participant.user,
          title: 'Session Rescheduled',
          message: `The session "${updatedSession.title}" has been rescheduled`,
          type: 'session_rescheduled',
          category: 'warning',
          relatedModel: 'Session',
          relatedId: session._id,
          actionUrl: `/sessions/${session._id}`,
          deliveryChannels: [{ channel: 'in_app' }, { channel: 'email' }]
        });
      }
    }

    res.json({
      success: true,
      message: 'Session updated successfully',
      data: updatedSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating session',
      error: error.message
    });
  }
};

// Mark attendance
const markAttendance = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { attendanceData } = req.body; // Array of { userId, attended, performance }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Update attendance for each participant
    for (const attendance of attendanceData) {
      const participantIndex = session.participants.findIndex(
        p => p.user.toString() === attendance.userId
      );

      if (participantIndex !== -1) {
        session.participants[participantIndex].attended = attendance.attended;
        session.participants[participantIndex].attendanceMarkedAt = new Date();
        
        if (attendance.performance) {
          session.participants[participantIndex].performance = attendance.performance;
        }

        // Update enrollment progress if attended
        if (attendance.attended) {
          const enrollment = await Enrollment.findById(
            session.participants[participantIndex].enrollment
          );
          
          if (enrollment) {
            enrollment.progress.completedSessions += 1;
            await enrollment.save();
          }
        }
      }
    }

    // Update session status to completed if all attendance is marked
    const allMarked = session.participants.every(p => p.attendanceMarkedAt);
    if (allMarked && session.status === 'in-progress') {
      session.status = 'completed';
      session.actualEndTime = new Date();
    }

    await session.save();

    res.json({
      success: true,
      message: 'Attendance marked successfully',
      data: session.participants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking attendance',
      error: error.message
    });
  }
};

// Get available ground slots
const getAvailableSlots = async (req, res) => {
  try {
    const { groundId, date, duration = 60 } = req.query;

    if (!groundId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Ground ID and date are required'
      });
    }

    const ground = await Ground.findById(groundId);
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
      ground: groundId,
      scheduledDate: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $nin: ['cancelled'] }
    }).select('groundSlot startTime endTime');

    // Generate available slots
    const availableSlots = [];
    const operatingHours = { start: 6, end: 22 }; // 6 AM to 10 PM

    for (let slot = 1; slot <= ground.groundSlot; slot++) {
      const slotAvailability = [];
      
      for (let hour = operatingHours.start; hour < operatingHours.end; hour++) {
        const startTime = `${hour.toString().padStart(2, '0')}:00`;
        const endHour = hour + Math.ceil(duration / 60);
        const endTime = `${endHour.toString().padStart(2, '0')}:00`;

        if (endHour <= operatingHours.end) {
          const isAvailable = await Session.isSlotAvailable(
            groundId,
            slot,
            new Date(date),
            startTime,
            endTime
          );

          if (isAvailable) {
            slotAvailability.push({
              startTime,
              endTime,
              duration
            });
          }
        }
      }

      availableSlots.push({
        slot,
        timeSlots: slotAvailability
      });
    }

    res.json({
      success: true,
      data: {
        ground: {
          id: ground._id,
          description: ground.description,
          totalSlots: ground.groundSlot,
          pricePerSlot: ground.pricePerSlot
        },
        date: date,
        availableSlots
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching available slots',
      error: error.message
    });
  }
};

// Get session calendar data
const getSessionCalendar = async (req, res) => {
  try {
    const { coach, program, startDate, endDate, userId } = req.query;

    const filter = {};
    if (coach) filter.coach = coach;
    if (program) filter.program = program;

    // Date range filter
    if (startDate && endDate) {
      filter.scheduledDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // If userId is provided, filter for user's sessions
    if (userId) {
      filter['participants.user'] = userId;
    }

    const sessions = await Session.find(filter)
      .populate('coach', 'userId')
      .populate('program', 'title category')
      .populate('ground', 'description')
      .select('title scheduledDate startTime endTime status program coach ground participants')
      .sort({ scheduledDate: 1 });

    // Transform sessions for calendar format
    const calendarEvents = sessions.map(session => ({
      id: session._id,
      title: session.title,
      start: new Date(`${session.scheduledDate.toISOString().split('T')[0]}T${session.startTime}:00`),
      end: new Date(`${session.scheduledDate.toISOString().split('T')[0]}T${session.endTime}:00`),
      status: session.status,
      program: session.program,
      coach: session.coach,
      ground: session.ground,
      participantCount: session.participants.length,
      color: getEventColor(session.status),
      extendedProps: {
        sessionId: session._id,
        programId: session.program._id,
        coachId: session.coach._id,
        groundId: session.ground._id
      }
    }));

    res.json({
      success: true,
      data: calendarEvents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching calendar data',
      error: error.message
    });
  }
};

// Helper function to get event color based on status
const getEventColor = (status) => {
  const colors = {
    scheduled: '#3174ad',
    'in-progress': '#f39c12',
    completed: '#27ae60',
    cancelled: '#e74c3c',
    rescheduled: '#9b59b6'
  };
  return colors[status] || '#95a5a6';
};

module.exports = {
  getAllSessions,
  getSessionById,
  createSession,
  bookSession,
  cancelBooking,
  updateSession,
  markAttendance,
  getAvailableSlots,
  getSessionCalendar
};
