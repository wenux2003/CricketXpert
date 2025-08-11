const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
   customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  programId: { type: mongoose.Schema.Types.ObjectId, ref: 'CoachingProgram', required: true },
  selectedSlot: { type: Date },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
