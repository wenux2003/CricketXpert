const Payment = require('../models/Payment');
const Enrollment = require('../models/Enrollment');
const CoachingProgram = require('../models/CoachingProgram');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

// Create payment
const createPayment = async (req, res) => {
  try {
    const {
      userId,
      enrollmentId,
      programId,
      amount,
      paymentMethod,
      paymentProvider = 'payhere',
      billingAddress,
      discounts = [],
      taxes = []
    } = req.body;

    // Verify enrollment exists
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Create payment record
    const payment = new Payment({
      user: userId,
      enrollment: enrollmentId,
      program: programId,
      amount,
      paymentMethod,
      paymentProvider,
      billingAddress,
      discounts,
      taxes,
      description: `Payment for coaching program enrollment`
    });

    await payment.save();

    // Update enrollment with payment ID
    enrollment.paymentId = payment._id;
    await enrollment.save();

    res.status(201).json({
      success: true,
      message: 'Payment record created successfully',
      data: {
        paymentId: payment._id,
        amount: payment.finalAmount,
        status: payment.status,
        receiptNumber: payment.receiptNumber
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating payment',
      error: error.message
    });
  }
};

// Process payment completion (webhook handler)
const processPaymentCompletion = async (req, res) => {
  try {
    const {
      paymentId,
      transactionId,
      providerTransactionId,
      status,
      providerData
    } = req.body;

    const payment = await Payment.findById(paymentId)
      .populate('enrollment')
      .populate('user')
      .populate('program');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Update payment status
    payment.status = status;
    payment.transactionId = transactionId;
    payment.providerTransactionId = providerTransactionId;
    payment.paymentDate = new Date();
    
    if (providerData) {
      payment.metadata.providerData = providerData;
    }

    await payment.save();

    // If payment successful, activate enrollment
    if (status === 'completed') {
      const enrollment = await Enrollment.findById(payment.enrollment._id);
      enrollment.status = 'active';
      enrollment.paymentStatus = 'completed';
      await enrollment.save();

      // Send success notification
      await Notification.createNotification({
        recipient: payment.user._id,
        title: 'Payment Successful',
        message: `Your payment for "${payment.program.title}" has been processed successfully.`,
        type: 'payment_received',
        category: 'success',
        relatedModel: 'Payment',
        relatedId: payment._id,
        actionUrl: `/dashboard/enrollments`,
        deliveryChannels: [{ channel: 'in_app' }, { channel: 'email' }]
      });

      // Notify coach about confirmed enrollment
      const coach = await payment.program.populate({
        path: 'coach',
        populate: {
          path: 'userId'
        }
      });

      if (coach.coach) {
        await Notification.createNotification({
          recipient: coach.coach.userId._id,
          title: 'Enrollment Confirmed',
          message: `${payment.user.firstName} ${payment.user.lastName} has confirmed enrollment in "${payment.program.title}"`,
          type: 'enrollment_confirmation',
          category: 'success',
          relatedModel: 'Enrollment',
          relatedId: enrollment._id,
          deliveryChannels: [{ channel: 'in_app' }]
        });
      }
    } else if (status === 'failed') {
      // Send failure notification
      await Notification.createNotification({
        recipient: payment.user._id,
        title: 'Payment Failed',
        message: `Your payment for "${payment.program.title}" could not be processed. Please try again.`,
        type: 'payment_failed',
        category: 'error',
        relatedModel: 'Payment',
        relatedId: payment._id,
        actionUrl: `/payments/${payment._id}/retry`,
        deliveryChannels: [{ channel: 'in_app' }, { channel: 'email' }]
      });
    }

    res.json({
      success: true,
      message: `Payment ${status} processed successfully`,
      data: {
        paymentId: payment._id,
        status: payment.status,
        enrollmentStatus: payment.enrollment.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing payment completion',
      error: error.message
    });
  }
};

// Get payment by ID
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('enrollment')
      .populate('program', 'title description');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment',
      error: error.message
    });
  }
};

// Get user payments
const getUserPayments = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { user: userId };
    if (status) {
      filter.status = status;
    }

    const payments = await Payment.find(filter)
      .populate('program', 'title')
      .populate('enrollment', 'enrollmentDate status')
      .sort({ paymentDate: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalPayments = await Payment.countDocuments(filter);

    res.json({
      success: true,
      data: payments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalPayments / parseInt(limit)),
        totalPayments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user payments',
      error: error.message
    });
  }
};

// Process refund
const processRefund = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { amount, reason } = req.body;

    const payment = await Payment.findById(paymentId)
      .populate('user')
      .populate('program');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only refund completed payments'
      });
    }

    const refundAmount = amount || payment.finalAmount;
    const totalRefunded = payment.totalRefunded;

    if (totalRefunded + refundAmount > payment.finalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Refund amount exceeds available balance'
      });
    }

    // Add refund record
    payment.refunds.push({
      amount: refundAmount,
      reason: reason || 'Enrollment cancellation',
      refundDate: new Date(),
      status: 'pending' // Would be updated by payment provider webhook
    });

    // Update payment status
    if (totalRefunded + refundAmount >= payment.finalAmount) {
      payment.status = 'refunded';
    } else {
      payment.status = 'partially_refunded';
    }

    await payment.save();

    // Send notification
    await Notification.createNotification({
      recipient: payment.user._id,
      title: 'Refund Processed',
      message: `A refund of ${refundAmount} has been initiated for your payment.`,
      type: 'payment_received',
      category: 'info',
      relatedModel: 'Payment',
      relatedId: payment._id,
      deliveryChannels: [{ channel: 'in_app' }, { channel: 'email' }]
    });

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refundAmount,
        totalRefunded: payment.totalRefunded,
        paymentStatus: payment.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing refund',
      error: error.message
    });
  }
};

// Get payment statistics
const getPaymentStats = async (req, res) => {
  try {
    const { startDate, endDate, coach, program } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.paymentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Build aggregation pipeline
    let pipeline = [
      { $match: { status: 'completed', ...dateFilter } }
    ];

    if (program) {
      pipeline.push({ $match: { program: mongoose.Types.ObjectId(program) } });
    }

    if (coach) {
      pipeline.push(
        {
          $lookup: {
            from: 'coachingprograms',
            localField: 'program',
            foreignField: '_id',
            as: 'programData'
          }
        },
        { $unwind: '$programData' },
        { $match: { 'programData.coach': mongoose.Types.ObjectId(coach) } }
      );
    }

    pipeline.push(
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$finalAmount' },
          totalPayments: { $sum: 1 },
          averagePayment: { $avg: '$finalAmount' },
          totalRefunded: { $sum: '$totalRefunded' }
        }
      }
    );

    const stats = await Payment.aggregate(pipeline);
    const result = stats[0] || {
      totalRevenue: 0,
      totalPayments: 0,
      averagePayment: 0,
      totalRefunded: 0
    };

    // Get payment method breakdown
    const methodBreakdown = await Payment.aggregate([
      { $match: { status: 'completed', ...dateFilter } },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          amount: { $sum: '$finalAmount' }
        }
      }
    ]);

    // Get monthly revenue trend
    const monthlyTrend = await Payment.aggregate([
      { $match: { status: 'completed', ...dateFilter } },
      {
        $group: {
          _id: {
            year: { $year: '$paymentDate' },
            month: { $month: '$paymentDate' }
          },
          revenue: { $sum: '$finalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        summary: result,
        paymentMethodBreakdown: methodBreakdown,
        monthlyTrend,
        netRevenue: result.totalRevenue - result.totalRefunded
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment statistics',
      error: error.message
    });
  }
};

// Generate payment receipt
const generateReceipt = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId)
      .populate('user', 'firstName lastName email')
      .populate('program', 'title description')
      .populate('enrollment', 'enrollmentDate');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Receipt only available for completed payments'
      });
    }

    // Generate receipt data
    const receiptData = {
      receiptNumber: payment.receiptNumber,
      paymentDate: payment.paymentDate,
      customer: {
        name: `${payment.user.firstName} ${payment.user.lastName}`,
        email: payment.user.email
      },
      program: {
        title: payment.program.title,
        description: payment.program.description
      },
      amount: payment.amount,
      discounts: payment.discounts,
      taxes: payment.taxes,
      finalAmount: payment.finalAmount,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId
    };

    res.json({
      success: true,
      data: receiptData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating receipt',
      error: error.message
    });
  }
};

module.exports = {
  createPayment,
  processPaymentCompletion,
  getPaymentById,
  getUserPayments,
  processRefund,
  getPaymentStats,
  generateReceipt
};
