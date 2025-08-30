const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  enrollment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true
  },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CoachingProgram',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'LKR'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'bank_transfer', 'mobile_payment', 'cash'],
    required: true
  },
  paymentProvider: {
    type: String,
    enum: ['stripe', 'paypal', 'razorpay', 'payhere', 'manual'],
    required: true
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  providerTransactionId: String, // Transaction ID from payment provider
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  dueDate: Date,
  description: String,
  metadata: {
    // Store additional payment provider specific data
    providerData: mongoose.Schema.Types.Mixed,
    receiptUrl: String,
    invoiceUrl: String
  },
  refunds: [{
    amount: Number,
    reason: String,
    refundDate: {
      type: Date,
      default: Date.now
    },
    refundTransactionId: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    }
  }],
  billingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  installments: [{
    installmentNumber: Number,
    amount: Number,
    dueDate: Date,
    paidDate: Date,
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue'],
      default: 'pending'
    }
  }],
  discounts: [{
    type: {
      type: String,
      enum: ['percentage', 'fixed_amount', 'coupon']
    },
    value: Number,
    code: String,
    description: String
  }],
  taxes: [{
    type: String,
    rate: Number,
    amount: Number
  }],
  finalAmount: Number, // Amount after discounts and taxes
  receiptNumber: {
    type: String,
    unique: true
  },
  notes: String
}, { timestamps: true });

// Indexes for performance
paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ enrollment: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ paymentDate: -1 });
paymentSchema.index({ status: 1, paymentDate: -1 });

// Virtual to calculate total refunded amount
paymentSchema.virtual('totalRefunded').get(function() {
  return this.refunds
    .filter(refund => refund.status === 'completed')
    .reduce((total, refund) => total + refund.amount, 0);
});

// Virtual to calculate net amount (after refunds)
paymentSchema.virtual('netAmount').get(function() {
  return this.finalAmount - this.totalRefunded;
});

// Pre-save middleware to generate receipt number
paymentSchema.pre('save', function(next) {
  if (!this.receiptNumber && this.status === 'completed') {
    // Generate receipt number: RCPT-YYYYMMDD-XXXXXX
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    this.receiptNumber = `RCPT-${date}-${random}`;
  }
  
  // Calculate final amount if not set
  if (!this.finalAmount) {
    let amount = this.amount;
    
    // Apply discounts
    this.discounts.forEach(discount => {
      if (discount.type === 'percentage') {
        amount -= (amount * discount.value / 100);
      } else if (discount.type === 'fixed_amount') {
        amount -= discount.value;
      }
    });
    
    // Add taxes
    this.taxes.forEach(tax => {
      amount += tax.amount;
    });
    
    this.finalAmount = Math.max(0, amount);
  }
  
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
