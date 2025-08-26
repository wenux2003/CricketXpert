const mongoose = require('mongoose');

const repairRequestSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  equipmentType: {
    type: String,
    enum: [
      'cricket_bat',
      'cricket_ball',
      'cricket_gloves',
      'cricket_pads',
      'cricket_helmet'
    ],
    required: true
  },
  damageType: { 
    type: String,
    required: true,
    enum: [
      "Bat Handle Damage",
      "Bat Surface Crack",
      "Ball Stitch Damage",
      "Gloves Tear",
      "Pads Crack",
      "Helmet Damage",
      "Other"
    ] 
  },

  description: { 
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 500,
    validate: {
      validator: function(v) {
        // No numbers and repeated single character sequences allowed
        return !/\d/.test(v) && !/(.)\1{3,}/.test(v);
      },
      message: props => `Description cannot contain numbers or repeated characters.`
    }
  },

  status: {
    type: String,
    enum: [
      'Pending', 'Approved', 'Rejected', 'Estimate Sent',
      'Customer Approved', 'Customer Rejected', 'In Repair',
      'Halfway Completed', 'Ready for Pickup', 'Completed', 'Cancelled'
    ],
    default: 'Pending'
  },
  rejectionReason: { type: String },
  costEstimate: { type: Number },
  timeEstimate: { type: String },
  assignedTechnician: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician' },
  repairProgress: { type: Number, min: 0, max: 100, default: 0 },
  currentStage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('RepairRequest', repairRequestSchema);