const express = require('express');
const router = express.Router();
const {
  generateUserCalendar,
  generateCoachCalendar,
  generateGoogleCalendarUrl,
  generateOutlookCalendarUrl,
  getSessionConflicts,
  generateSessionBookingEvent
} = require('../utils/calendarIntegration');
const Session = require('../models/Session');
const User = require('../models/User');

// @route   GET /api/calendar/user/:userId/ical
// @desc    Generate iCal calendar for user's sessions
// @access  Private (User themselves)
router.get('/user/:userId/ical', async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, programId } = req.query;

    const calendar = await generateUserCalendar(userId, {
      startDate,
      endDate,
      programId
    });

    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', 'attachment; filename="my-sessions.ics"');
    res.send(calendar);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating calendar',
      error: error.message
    });
  }
});

// @route   GET /api/calendar/coach/:coachId/ical
// @desc    Generate iCal calendar for coach's sessions
// @access  Private (Coach themselves)
router.get('/coach/:coachId/ical', async (req, res) => {
  try {
    const { coachId } = req.params;
    const { startDate, endDate } = req.query;

    const calendar = await generateCoachCalendar(coachId, {
      startDate,
      endDate
    });

    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', 'attachment; filename="coaching-sessions.ics"');
    res.send(calendar);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating coach calendar',
      error: error.message
    });
  }
});

// @route   GET /api/calendar/session/:sessionId/google
// @desc    Generate Google Calendar URL for session
// @access  Private
router.get('/session/:sessionId/google', async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId)
      .populate('program', 'title')
      .populate('ground', 'description');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const googleUrl = generateGoogleCalendarUrl(session);

    res.json({
      success: true,
      data: {
        url: googleUrl,
        sessionTitle: session.title
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating Google Calendar URL',
      error: error.message
    });
  }
});

// @route   GET /api/calendar/session/:sessionId/outlook
// @desc    Generate Outlook Calendar URL for session
// @access  Private
router.get('/session/:sessionId/outlook', async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId)
      .populate('program', 'title')
      .populate('ground', 'description');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const outlookUrl = generateOutlookCalendarUrl(session);

    res.json({
      success: true,
      data: {
        url: outlookUrl,
        sessionTitle: session.title
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating Outlook Calendar URL',
      error: error.message
    });
  }
});

// @route   GET /api/calendar/conflicts
// @desc    Check for session conflicts
// @access  Private
router.get('/conflicts', async (req, res) => {
  try {
    const { groundId, groundSlot, date, startTime, endTime, excludeSessionId } = req.query;

    if (!groundId || !groundSlot || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }

    const conflicts = await getSessionConflicts(
      groundId,
      parseInt(groundSlot),
      date,
      startTime,
      endTime,
      excludeSessionId
    );

    res.json({
      success: true,
      data: {
        hasConflicts: conflicts.length > 0,
        conflicts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking conflicts',
      error: error.message
    });
  }
});

// @route   POST /api/calendar/session/:sessionId/booking-event
// @desc    Generate calendar event for session booking
// @access  Private (User who booked the session)
router.post('/session/:sessionId/booking-event', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.body;

    const session = await Session.findById(sessionId)
      .populate('program', 'title')
      .populate('ground', 'description')
      .populate({
        path: 'coach',
        populate: {
          path: 'userId',
          select: 'firstName lastName email'
        }
      });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is registered for this session
    const isRegistered = session.participants.some(
      participant => participant.user.toString() === userId
    );

    if (!isRegistered) {
      return res.status(403).json({
        success: false,
        message: 'User is not registered for this session'
      });
    }

    const calendarEvent = generateSessionBookingEvent(session, user);

    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', 'attachment; filename="session-booking.ics"');
    res.send(calendarEvent);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating booking event',
      error: error.message
    });
  }
});

// @route   GET /api/calendar/session/:sessionId/all-links
// @desc    Get all calendar links for a session
// @access  Private
router.get('/session/:sessionId/all-links', async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId)
      .populate('program', 'title')
      .populate('ground', 'description');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const googleUrl = generateGoogleCalendarUrl(session);
    const outlookUrl = generateOutlookCalendarUrl(session);

    res.json({
      success: true,
      data: {
        session: {
          id: session._id,
          title: session.title,
          date: session.scheduledDate,
          startTime: session.startTime,
          endTime: session.endTime
        },
        calendarLinks: {
          google: googleUrl,
          outlook: outlookUrl,
          ical: `/api/calendar/session/${session._id}/booking-event`
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating calendar links',
      error: error.message
    });
  }
});

module.exports = router;
