const Notification = require('../models/Notification');

// Get user notifications
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { 
      page = 1, 
      limit = 20, 
      type, 
      category, 
      isRead, 
      priority 
    } = req.query;

    // Build filter
    const filter = { recipient: userId };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (isRead !== undefined) filter.isRead = isRead === 'true';
    if (priority) filter.priority = priority;

    // Exclude expired notifications
    filter.$or = [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ];

    const notifications = await Notification.find(filter)
      .populate('sender', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalNotifications = await Notification.countDocuments(filter);
    const unreadCount = await Notification.getUnreadCount(userId);

    res.json({
      success: true,
      data: notifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalNotifications / parseInt(limit)),
        totalNotifications
      },
      unreadCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};

// Get notification by ID
const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('sender', 'firstName lastName')
      .populate('recipient', 'firstName lastName');

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Mark as read if not already read
    if (!notification.isRead) {
      await notification.markAsRead();
    }

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notification',
      error: error.message
    });
  }
};

// Create notification (admin/system use)
const createNotification = async (req, res) => {
  try {
    const {
      recipient,
      sender,
      title,
      message,
      type,
      category = 'info',
      priority = 'medium',
      relatedModel,
      relatedId,
      actionUrl,
      actionText,
      data,
      deliveryChannels = [{ channel: 'in_app' }],
      expiresAt,
      scheduledFor
    } = req.body;

    const notification = await Notification.createNotification({
      recipient,
      sender,
      title,
      message,
      type,
      category,
      priority,
      relatedModel,
      relatedId,
      actionUrl,
      actionText,
      data,
      deliveryChannels,
      expiresAt,
      scheduledFor
    });

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating notification',
      error: error.message
    });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.markAsRead();

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: { isRead: true, readAt: notification.readAt }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error.message
    });
  }
};

// Mark all notifications as read for a user
const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    await Notification.markAllAsRead(userId);

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking all notifications as read',
      error: error.message
    });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndDelete(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: error.message
    });
  }
};

// Get unread count for a user
const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;

    const unreadCount = await Notification.getUnreadCount(userId);

    res.json({
      success: true,
      data: { unreadCount }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count',
      error: error.message
    });
  }
};

// Get notification preferences for a user
const getNotificationPreferences = async (req, res) => {
  try {
    const { userId } = req.params;

    // This would typically come from a user preferences model
    // For now, return default preferences
    const defaultPreferences = {
      in_app: {
        enrollment_confirmation: true,
        session_scheduled: true,
        session_reminder: true,
        session_cancelled: true,
        payment_received: true,
        payment_failed: true,
        program_completed: true,
        certificate_ready: true,
        coach_feedback: true,
        general: true
      },
      email: {
        enrollment_confirmation: true,
        session_scheduled: true,
        session_reminder: false,
        session_cancelled: true,
        payment_received: true,
        payment_failed: true,
        program_completed: true,
        certificate_ready: true,
        coach_feedback: false,
        general: false
      },
      sms: {
        enrollment_confirmation: false,
        session_scheduled: true,
        session_reminder: true,
        session_cancelled: true,
        payment_received: false,
        payment_failed: true,
        program_completed: false,
        certificate_ready: false,
        coach_feedback: false,
        general: false
      }
    };

    res.json({
      success: true,
      data: defaultPreferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notification preferences',
      error: error.message
    });
  }
};

// Update notification preferences
const updateNotificationPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const { preferences } = req.body;

    // This would typically update a user preferences model
    // For now, just return success
    res.json({
      success: true,
      message: 'Notification preferences updated successfully',
      data: preferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating notification preferences',
      error: error.message
    });
  }
};

// Send bulk notifications
const sendBulkNotifications = async (req, res) => {
  try {
    const {
      recipients, // Array of user IDs
      title,
      message,
      type,
      category = 'info',
      priority = 'medium',
      deliveryChannels = [{ channel: 'in_app' }],
      actionUrl,
      actionText
    } = req.body;

    const notifications = [];

    for (const recipientId of recipients) {
      try {
        const notification = await Notification.createNotification({
          recipient: recipientId,
          title,
          message,
          type,
          category,
          priority,
          deliveryChannels,
          actionUrl,
          actionText
        });
        notifications.push(notification);
      } catch (error) {
        console.error(`Error creating notification for user ${recipientId}:`, error);
      }
    }

    res.json({
      success: true,
      message: `Sent ${notifications.length} notifications successfully`,
      data: {
        sent: notifications.length,
        requested: recipients.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending bulk notifications',
      error: error.message
    });
  }
};

// Get notification statistics
const getNotificationStats = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const userFilter = userId ? { recipient: userId } : {};

    // Get overall stats
    const stats = await Notification.aggregate([
      { $match: { ...dateFilter, ...userFilter } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          read: { $sum: { $cond: ['$isRead', 1, 0] } },
          unread: { $sum: { $cond: ['$isRead', 0, 1] } }
        }
      }
    ]);

    // Get stats by type
    const typeStats = await Notification.aggregate([
      { $match: { ...dateFilter, ...userFilter } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          read: { $sum: { $cond: ['$isRead', 1, 0] } }
        }
      }
    ]);

    // Get stats by category
    const categoryStats = await Notification.aggregate([
      { $match: { ...dateFilter, ...userFilter } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = stats[0] || { total: 0, read: 0, unread: 0 };

    res.json({
      success: true,
      data: {
        summary: {
          ...result,
          readRate: result.total > 0 ? (result.read / result.total) * 100 : 0
        },
        byType: typeStats,
        byCategory: categoryStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notification statistics',
      error: error.message
    });
  }
};

module.exports = {
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
};
