const mongoose = require('mongoose');
const coachingProgramSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, maxlength: 1000 },
  coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'MCoach', required: true },
  
  programType: { 
    type: String, 
    enum: ['individual', 'group', 'online', 'hybrid'], 
    required: true 
  },
  
  category: { 
    type: String, 
    enum: ['Batting', 'Bowling', 'Fielding', 'Wicket Keeping', 'All-rounder', 'Mental Coaching'],
    required: true 
  },
  
  level: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'], 
    required: true 
  },
  
  duration: {
    totalSessions: { type: Number, required: true, min: 1 },
    sessionDurationMinutes: { type: Number, required: true, min: 30 },
    programLengthWeeks: { type: Number, required: true, min: 1 }
  },
  
  pricing: {
    basePrice: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'LKR' },
    discountPercentage: { type: Number, default: 0, min: 0, max: 100 }
  },
  
  capacity: {
    maxStudents: { type: Number, required: true, min: 1 },
    currentEnrollments: { type: Number, default: 0 }
  },
  
  prerequisites: [String],
  objectives: [String],
  
  isActive: { type: Boolean, default: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  
  // Course materials
  materials: [{
    title: { type: String, required: true },
    type: { type: String, enum: ['video', 'document', 'quiz', 'image'], required: true },
    filePath: { type: String, required: true },
    fileSize: Number,
    uploadedAt: { type: Date, default: Date.now },
    description: String,
    isRequired: { type: Boolean, default: false }
  }],
  
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('MCoachingProgram', coachingProgramSchema)