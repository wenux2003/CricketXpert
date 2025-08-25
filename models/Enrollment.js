// models/Enrollment.js
const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  program: { type: mongoose.Schema.Types.ObjectId, ref: "MCoachingProgram", required: true },
  selectedSlot: {
    date: Date,
    startTime: String,
    endTime: String
  },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },

  // progress tracking
  totalSessions: { type: Number, default: 0 },
  completedSessions: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
  certificateIssued: { type: Boolean, default: false },

  // 🆕 Payment details
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  paymentMethod: { type: String, enum: ["card", "paypal", "upi", "stripe"], default: "card" },
  transactionId: { type: String }, // reference from Stripe/PayPal/etc.
  amountPaid: { type: Number },
  paidAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
