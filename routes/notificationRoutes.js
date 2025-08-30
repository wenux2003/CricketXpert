const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  getNotificationById,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  getNotificationPreferences,
  updateNotificationPreferences,
  sendBulkNotifications,
  getNotificationStats
} = require('../controllers/notificationController');

// @route   GET /api/notifications/user/:userId
// @desc    Get user notifications
// @access  Private (User themselves)
router.get('/user/:userId', getUserNotifications);

// @route   GET /api/notifications/:id
// @desc    Get notification by ID
// @access  Private
router.get('/:id', getNotificationById);

// @route   POST /api/notifications
// @desc    Create notification (admin/system use)
// @access  Private (Admin only)
router.post('/', createNotification);

// @route   PUT /api/notifications/:notificationId/read
// @desc    Mark notification as read
// @access  Private (User themselves)
router.put('/:notificationId/read', markAsRead);

// @route   PUT /api/notifications/user/:userId/mark-all-read
// @desc    Mark all notifications as read for user
// @access  Private (User themselves)
router.put('/user/:userId/mark-all-read', markAllAsRead);

// @route   DELETE /api/notifications/:notificationId
// @desc    Delete notification
// @access  Private (User themselves)
router.delete('/:notificationId', deleteNotification);

// @route   GET /api/notifications/user/:userId/unread-count
// @desc    Get unread notification count
// @access  Private (User themselves)
router.get('/user/:userId/unread-count', getUnreadCount);

// @route   GET /api/notifications/user/:userId/preferences
// @desc    Get notification preferences
// @access  Private (User themselves)
router.get('/user/:userId/preferences', getNotificationPreferences);

// @route   PUT /api/notifications/user/:userId/preferences
// @desc    Update notification preferences
// @access  Private (User themselves)
router.put('/user/:userId/preferences', updateNotificationPreferences);

// @route   POST /api/notifications/bulk
// @desc    Send bulk notifications
// @access  Private (Admin only)
router.post('/bulk', sendBulkNotifications);

// @route   GET /api/notifications/stats
// @desc    Get notification statistics
// @access  Private (Admin only)
router.get('/stats', getNotificationStats);

module.exports = router;
