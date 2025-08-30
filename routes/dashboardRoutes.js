const express = require('express');
const router = express.Router();
const {
  getUserDashboard,
  getCoachDashboard,
  getAdminDashboard
} = require('../controllers/dashboardController');

// @route   GET /api/dashboard/user/:userId
// @desc    Get user dashboard data
// @access  Private (User themselves)
router.get('/user/:userId', getUserDashboard);

// @route   GET /api/dashboard/coach/:coachId
// @desc    Get coach dashboard data
// @access  Private (Coach themselves)
router.get('/coach/:coachId', getCoachDashboard);

// @route   GET /api/dashboard/admin
// @desc    Get admin dashboard data
// @access  Private (Admin only)
router.get('/admin', getAdminDashboard);

module.exports = router;
