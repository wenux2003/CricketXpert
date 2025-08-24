const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  priceAtAdd: {
    type: Number,
    required: true
  }
});

const cartSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 24 * 60 * 60 * 1000 // 24 hours
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);