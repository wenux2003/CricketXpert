const mongoose = require('mongoose');

// Schema for items in the order
const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: { type: Number, required: true, min: 1 },
  priceAtOrder: { type: Number, required: true, min: 0 }
});

// Main Order schema
const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: {
    type: [orderItemSchema],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Processing', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },
  date: {
    type: Date,
    default: Date.now
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: true
  }
});

module.exports = mongoose.model('Order', orderSchema);
