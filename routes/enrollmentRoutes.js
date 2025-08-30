const express = require('express');
const router = express.Router();
const {
  createEnrollment,
  confirmPayment,
  getUserEnrollments,
  getEnrollmentById,
  updateProgress,
  addCoachFeedback,
  cancelEnrollment,
  generateCertificate
} = require('../controllers/enrollmentController');

// @route   POST /api/enrollments
// @desc    Create new enrollment
// @access  Private (Customer)
router.post('/', createEnrollment);

// @route   POST /api/enrollments/confirm-payment
// @desc    Confirm enrollment payment
// @access  Private (Payment webhook or Admin)
router.post('/confirm-payment', confirmPayment);

// @route   GET /api/enrollments/user/:userId
// @desc    Get user enrollments
// @access  Private (User themselves or Admin)
router.get('/user/:userId', getUserEnrollments);

// @route   GET /api/enrollments/:id
// @desc    Get enrollment by ID
// @access  Private (User, Coach, or Admin)
router.get('/:id', getEnrollmentById);

// @route   PUT /api/enrollments/:enrollmentId/progress
// @desc    Update enrollment progress
// @access  Private (Coach or Admin)
router.put('/:enrollmentId/progress', updateProgress);

// @route   POST /api/enrollments/:enrollmentId/feedback
// @desc    Add coach feedback
// @access  Private (Coach only)
router.post('/:enrollmentId/feedback', addCoachFeedback);

// @route   PUT /api/enrollments/:enrollmentId/cancel
// @desc    Cancel enrollment
// @access  Private (User or Admin)
router.put('/:enrollmentId/cancel', cancelEnrollment);

// @route   POST /api/enrollments/:enrollmentId/certificate
// @desc    Generate certificate for completed enrollment
// @access  Private (User or Admin)
router.post('/:enrollmentId/certificate', generateCertificate);

module.exports = router;
