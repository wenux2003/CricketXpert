// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // recipient
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional
  type: { 
    type: String, 
    enum: [
      "enrollment_confirmed", 
      "session_scheduled", 
      "session_rescheduled", 
      "session_cancelled",
      "feedback_received",
      "material_uploaded",
      "certificate_issued",
      "general"
    ], 
    default: "general" 
  },
  message: { type: String, required: true },
  relatedId: { type: mongoose.Schema.Types.ObjectId }, // link to session/program/etc.
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
