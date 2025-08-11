const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
customerId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
type: { type: String, enum: ['coaching', 'ground'], required: true },
coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // only for coaching
groundId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ground', default: null }, // only for ground
sessionTime: { type: Date, required: true },
startTime: { type: String, default: null },  // optional, for ground bookings
endTime: { type: String, default: null },    // optional, for ground bookings
status: { type: String, enum: ['confirmed', 'pending', 'cancelled', 'rescheduled'], default: 'pending' },
paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment", // Reference to Payment table
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
