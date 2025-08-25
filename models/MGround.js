// models/Ground.js
const mongoose = require("mongoose");

const groundSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  capacity: Number,

  // Optional: add pricing if grounds have booking fees
  hourlyRate: { type: Number, default: 0 },

  // track bookings
  bookings: [
    {
      sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
      date: Date,
      startTime: String,
      endTime: String,
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("MGround", groundSchema);
