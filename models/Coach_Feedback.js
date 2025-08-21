// models/Feedback.js
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  program: { type: mongoose.Schema.Types.ObjectId, ref: "MCoachingProgram" },
  content: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  type: { type: String, enum: ["feedback", "complaint"], default: "feedback" }
}, { timestamps: true });

module.exports = mongoose.model("Coach_Feedback", feedbackSchema);
