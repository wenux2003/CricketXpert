const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'RepairRequest', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  response: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);