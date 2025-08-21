// models/Session.js
const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  enrollment: { type: mongoose.Schema.Types.ObjectId, ref: "Enrollment", required: true },
  program: { type: mongoose.Schema.Types.ObjectId, ref: "MCoachingProgram", required: true },
  coach: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  player: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ground: { type: mongoose.Schema.Types.ObjectId, ref: "MGround", required: true }, // 🆕 link ground
  date: { type: Date, required: true },
  startTime: String,
  endTime: String,
  status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
  attendance: { type: Boolean, default: false },
  progressNotes: String
}, { timestamps: true });

module.exports = mongoose.model("Session", sessionSchema);
