// models/CoachAvailability.js
const mongoose = require("mongoose");

const coachAvailabilitySchema = new mongoose.Schema({
  coach: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  slots: [{
    startTime: String,
    endTime: String,
    isAvailable: { type: Boolean, default: true }
  }],
  overriddenByManager: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("CoachAvailability", coachAvailabilitySchema);
