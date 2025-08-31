const mongoose = require('mongoose');

const coachingProgramSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach',
    required: true
  },
  category: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'professional'],
    required: true
  },
  specialization: {
    type: String,
    enum: ['batting', 'bowling', 'fielding', 'wicket-keeping', 'all-rounder', 'fitness', 'mental-coaching'],
    required: true
  },
  duration: {
    weeks: {
      type: Number,
      required: true,
      min: 1
    },
    sessionsPerWeek: {
      type: Number,
      required: true,
      min: 1,
      max: 7
    }
  },
  totalSessions: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  maxParticipants: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  currentEnrollments: {
    type: Number,
    default: 0
  },
  materials: [{
    title: String,
    type: {
      type: String,
      enum: ['video', 'document', 'image', 'link']
    },
    url: String,
    description: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  curriculum: [{
    week: Number,
    session: Number,
    title: String,
    objectives: [String],
    duration: Number, // in minutes
    materials: [String]
  }],
  requirements: [String],
  benefits: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  imageUrl: String,
  tags: [String],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  }
}, { timestamps: true });

// Indexes for better performance
coachingProgramSchema.index({ category: 1, specialization: 1, isActive: 1 });
coachingProgramSchema.index({ coach: 1 });
coachingProgramSchema.index({ startDate: 1, endDate: 1 });

// Virtual to check if program is full
coachingProgramSchema.virtual('isFull').get(function() {
  return this.currentEnrollments >= this.maxParticipants;
});

// Pre-save middleware to calculate total sessions
coachingProgramSchema.pre('save', function(next) {
  if (this.isModified('duration')) {
    this.totalSessions = this.duration.weeks * this.duration.sessionsPerWeek;
  }
  next();
});

// Pagination plugin commented out - install mongoose-paginate-v2 to enable
// coachingProgramSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('CoachingProgram', coachingProgramSchema);
