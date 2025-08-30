const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  type: {
    type: String,
    enum: [
      'enrollment_confirmation',
      'enrollment_pending',
      'enrollment_rejected',
      'session_scheduled',
      'session_reminder',
      'session_cancelled',
      'session_rescheduled',
      'session_completed',
      'payment_received',
      'payment_failed',
      'payment_reminder',
      'program_starting',
      'program_completed',
      'certificate_ready',
      'coach_feedback',
      'general',
      'system'
    ],
    required: true
  },
  category: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  relatedModel: {
    type: String,
    enum: ['Enrollment', 'Session', 'Payment', 'CoachingProgram', 'Certificate']
  },
  relatedId: mongoose.Schema.Types.ObjectId,
  actionUrl: String, // URL to redirect when notification is clicked
  actionText: String, // Text for action button
  data: mongoose.Schema.Types.Mixed, // Additional data for the notification
  deliveryChannels: [{
    channel: {
      type: String,
      enum: ['in_app', 'email', 'sms', 'push'],
      required: true
    },
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date,
    error: String
  }],
  expiresAt: Date,
  scheduledFor: Date // For scheduled notifications
}, { timestamps: true });

// Indexes for performance
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1, category: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
notificationSchema.index({ scheduledFor: 1 });

// Static method to create and send notification
notificationSchema.statics.createNotification = async function(notificationData) {
  try {
    const notification = new this(notificationData);
    await notification.save();
    
    // You can add logic here to send to external services (email, SMS, etc.)
    // For now, we'll just mark in-app as sent
    notification.deliveryChannels.forEach(channel => {
      if (channel.channel === 'in_app') {
        channel.sent = true;
        channel.sentAt = new Date();
      }
    });
    
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Method to mark notification as read
notificationSchema.methods.markAsRead = async function() {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    await this.save();
  }
  return this;
};

// Static method to get unread count for a user
notificationSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({
    recipient: userId,
    isRead: false,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ]
  });
};

// Static method to mark all notifications as read for a user
notificationSchema.statics.markAllAsRead = async function(userId) {
  return await this.updateMany(
    {
      recipient: userId,
      isRead: false
    },
    {
      $set: {
        isRead: true,
        readAt: new Date()
      }
    }
  );
};

module.exports = mongoose.model('Notification', notificationSchema);
