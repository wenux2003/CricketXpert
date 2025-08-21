const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
  UserId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  },
  specialization: { 
    type: [String], 
    enum: ['Batting', 'Bowling', 'Fielding', 'Wicket Keeping', 'All-rounder', 'Mental Coaching'],
    required: true
  },
  experienceYears: { type: Number, required: true, min: 0 },
  bio: { type: String, maxlength: 500 },
  hourlyRate: { type: Number, required: true, min: 0 },
  
  // Regular availability
  availability: [{
    day: { 
      type: String, 
      required: true,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isActive: { type: Boolean, default: true }
  }],
  
  // Emergency overrides by coach manager
  availabilityOverrides: [{
    date: { type: Date, required: true },
    isAvailable: { type: Boolean, required: true },
    reason: String,
    overriddenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    overriddenAt: { type: Date, default: Date.now }
  }],
  
  // Session metrics for payroll
  sessionMetrics: {
    totalSessions: { type: Number, default: 0 },
    completedSessions: { type: Number, default: 0 },
    cancelledSessions: { type: Number, default: 0 },
    noShowSessions: { type: Number, default: 0 },
    currentMonthSessions: { type: Number, default: 0 },
    lastResetDate: { type: Date, default: Date.now }
  },
  
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  rating: {
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 }
  },
  
  certifications: [{
    name: String,
    issuedBy: String,
    issuedDate: Date,
    expiryDate: Date,
    certificateUrl: String
  }]
}, { timestamps: true });  //Coach's Certificate


module.exports = mongoose.model('MCoach', coachSchema)

