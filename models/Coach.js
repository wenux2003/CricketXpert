const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specializations: [{
    type: String,
    enum: ['batting', 'bowling', 'fielding', 'wicket-keeping', 'all-rounder', 'fitness', 'mental-coaching']
  }],
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  certifications: [{
    name: String,
    issuedBy: String,
    dateIssued: Date,
    certificateUrl: String
  }],
  bio: {
    type: String,
    maxlength: 1000
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  availability: [{
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: String, // Format: "HH:MM"
    endTime: String    // Format: "HH:MM"
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  profileImage: String,
  achievements: [String],
  assignedPrograms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CoachingProgram'
  }]
}, { timestamps: true });

// Index for better query performance
coachSchema.index({ specializations: 1, isActive: 1 });
coachSchema.index({ rating: -1 });

module.exports = mongoose.model('Coach', coachSchema);
