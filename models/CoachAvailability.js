const mongoose = require('mongoose');

const coachAvailabilitySchema = new mongoose.Schema({
  coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  availableSlots: [{
    date: { type: Date, required: true },
    timeStart: { type: String, required: true }, 
    timeEnd: { type: String, required: true }    
  }],
  overriddenAvailability: [{ type: Object }], 
}, { timestamps: true });

module.exports = mongoose.model('CoachAvailability', coachAvailabilitySchema);
