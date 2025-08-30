const express = require('express');
const router = express.Router();
const {
  getAllSessions,
  getSessionById,
  createSession,
  bookSession,
  cancelBooking,
  updateSession,
  markAttendance,
  getAvailableSlots,
  getSessionCalendar
} = require('../controllers/sessionController');

// @route   GET /api/sessions
// @desc    Get all sessions with filters
// @access  Private
router.get('/', getAllSessions);

// @route   GET /api/sessions/:id
// @desc    Get session by ID
// @access  Private
router.get('/:id', getSessionById);

// @route   POST /api/sessions
// @desc    Create new session
// @access  Private (Coach Manager or Coach)
router.post('/', createSession);

// @route   POST /api/sessions/:sessionId/book
// @desc    Book session for user
// @access  Private (Customer)
router.post('/:sessionId/book', bookSession);

// @route   POST /api/sessions/:sessionId/cancel-booking
// @desc    Cancel session booking
// @access  Private (Customer)
router.post('/:sessionId/cancel-booking', cancelBooking);

// @route   PUT /api/sessions/:id
// @desc    Update session
// @access  Private (Coach Manager or assigned Coach)
router.put('/:id', updateSession);

// @route   POST /api/sessions/:sessionId/attendance
// @desc    Mark attendance for session
// @access  Private (Coach only)
router.post('/:sessionId/attendance', markAttendance);

// @route   GET /api/sessions/available-slots
// @desc    Get available ground slots for date
// @access  Public
router.get('/available-slots', getAvailableSlots);

// @route   GET /api/sessions/calendar
// @desc    Get session calendar data
// @access  Private
router.get('/calendar', getSessionCalendar);

module.exports = router;
