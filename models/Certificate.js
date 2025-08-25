// models/Certificate.js
const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  program: { type: mongoose.Schema.Types.ObjectId, ref: "MCoachingProgram", required: true },
  certificateUrl: { type: String, required: true }, // PDF link
  issuedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Certificate", certificateSchema);
