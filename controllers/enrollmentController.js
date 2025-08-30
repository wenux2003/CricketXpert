const Enrollment = require('../models/Enrollment');
const CoachingProgram = require('../models/CoachingProgram');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const Certificate = require('../models/Certificate');
const User = require('../models/User');
const Coach = require('../models/Coach');

// Create new enrollment
const createEnrollment = async (req, res) => {
  try {
    const { userId, programId, paymentMethod } = req.body;

    // Check if program exists and is active
    const program = await CoachingProgram.findById(programId);
    if (!program || !program.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Program not found or inactive'
      });
    }

    // Check if program is full
    if (program.currentEnrollments >= program.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Program is full'
      });
    }

    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      program: programId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'User is already enrolled in this program'
      });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      user: userId,
      program: programId,
      progress: {
        totalSessions: program.totalSessions
      },
      status: 'pending' // Will be activated after payment
    });

    await enrollment.save();

    // Create payment record
    const payment = new Payment({
      user: userId,
      enrollment: enrollment._id,
      program: programId,
      amount: program.price,
      paymentMethod,
      paymentProvider: 'payhere', // or your preferred provider
      description: `Enrollment for ${program.title}`
    });

    await payment.save();

    // Update enrollment with payment ID
    enrollment.paymentId = payment._id;
    await enrollment.save();

    // Update program enrollment count
    await CoachingProgram.findByIdAndUpdate(programId, {
      $inc: { currentEnrollments: 1 }
    });

    // Send notifications
    await Notification.createNotification({
      recipient: userId,
      title: 'Enrollment Pending',
      message: `Your enrollment for "${program.title}" is pending payment confirmation.`,
      type: 'enrollment_pending',
      category: 'info',
      relatedModel: 'Enrollment',
      relatedId: enrollment._id,
      actionUrl: `/enrollments/${enrollment._id}`,
      deliveryChannels: [{ channel: 'in_app' }, { channel: 'email' }]
    });

    // Notify coach
    const coach = await Coach.findById(program.coach).populate('userId');
    if (coach) {
      await Notification.createNotification({
        recipient: coach.userId._id,
        title: 'New Enrollment',
        message: `New student enrolled in your program "${program.title}"`,
        type: 'enrollment_pending',
        category: 'info',
        relatedModel: 'Enrollment',
        relatedId: enrollment._id,
        deliveryChannels: [{ channel: 'in_app' }]
      });
    }

    res.status(201).json({
      success: true,
      message: 'Enrollment created successfully',
      data: {
        enrollment,
        payment: {
          id: payment._id,
          amount: payment.amount,
          status: payment.status
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating enrollment',
      error: error.message
    });
  }
};

// Confirm enrollment payment
const confirmPayment = async (req, res) => {
  try {
    const { enrollmentId, transactionId, providerTransactionId } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId)
      .populate('program')
      .populate('user');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Update payment status
    const payment = await Payment.findByIdAndUpdate(
      enrollment.paymentId,
      {
        status: 'completed',
        transactionId,
        providerTransactionId,
        paymentDate: new Date()
      },
      { new: true }
    );

    // Update enrollment status
    enrollment.status = 'active';
    enrollment.paymentStatus = 'completed';
    await enrollment.save();

    // Send confirmation notifications
    await Notification.createNotification({
      recipient: enrollment.user._id,
      title: 'Enrollment Confirmed',
      message: `Your enrollment for "${enrollment.program.title}" has been confirmed. Welcome!`,
      type: 'enrollment_confirmation',
      category: 'success',
      relatedModel: 'Enrollment',
      relatedId: enrollment._id,
      actionUrl: `/dashboard/enrollments`,
      deliveryChannels: [{ channel: 'in_app' }, { channel: 'email' }]
    });

    // Notify coach
    const coach = await Coach.findById(enrollment.program.coach).populate('userId');
    if (coach) {
      await Notification.createNotification({
        recipient: coach.userId._id,
        title: 'Enrollment Confirmed',
        message: `${enrollment.user.firstName} ${enrollment.user.lastName} has confirmed enrollment in "${enrollment.program.title}"`,
        type: 'enrollment_confirmation',
        category: 'success',
        relatedModel: 'Enrollment',
        relatedId: enrollment._id,
        deliveryChannels: [{ channel: 'in_app' }]
      });
    }

    res.json({
      success: true,
      message: 'Payment confirmed and enrollment activated',
      data: enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error confirming payment',
      error: error.message
    });
  }
};

// Get user enrollments
const getUserEnrollments = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { user: userId };
    if (status) {
      filter.status = status;
    }

    const enrollments = await Enrollment.find(filter)
      .populate({
        path: 'program',
        populate: {
          path: 'coach',
          populate: {
            path: 'userId',
            select: 'firstName lastName'
          }
        }
      })
      .populate('sessions')
      .sort({ enrollmentDate: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalEnrollments = await Enrollment.countDocuments(filter);

    res.json({
      success: true,
      data: enrollments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalEnrollments / parseInt(limit)),
        totalEnrollments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user enrollments',
      error: error.message
    });
  }
};

// Get enrollment by ID
const getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate({
        path: 'program',
        populate: {
          path: 'coach',
          populate: {
            path: 'userId',
            select: 'firstName lastName email'
          }
        }
      })
      .populate('user', 'firstName lastName email')
      .populate('sessions')
      .populate('certificateId');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollment',
      error: error.message
    });
  }
};

// Update enrollment progress
const updateProgress = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { completedSessions, completedMaterials, skillAssessments } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Update progress
    if (completedSessions !== undefined) {
      enrollment.progress.completedSessions = completedSessions;
    }

    if (completedMaterials) {
      enrollment.progress.completedMaterials = completedMaterials;
    }

    if (skillAssessments) {
      enrollment.progress.skillAssessments = skillAssessments;
    }

    // Calculate progress percentage
    const progressPercentage = Math.round(
      (enrollment.progress.completedSessions / enrollment.progress.totalSessions) * 100
    );
    enrollment.progress.progressPercentage = progressPercentage;

    // Check if program is completed
    if (progressPercentage >= 100 && enrollment.status === 'active') {
      enrollment.status = 'completed';
      
      // Check certificate eligibility
      if (progressPercentage >= 80) {
        enrollment.certificateEligible = true;
      }

      // Send completion notification
      await Notification.createNotification({
        recipient: enrollment.user,
        title: 'Program Completed!',
        message: `Congratulations! You have completed the "${enrollment.program.title}" program.`,
        type: 'program_completed',
        category: 'success',
        relatedModel: 'Enrollment',
        relatedId: enrollment._id,
        actionUrl: `/dashboard/certificates`,
        deliveryChannels: [{ channel: 'in_app' }, { channel: 'email' }]
      });
    }

    await enrollment.save();

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: enrollment.progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating progress',
      error: error.message
    });
  }
};

// Add coach feedback
const addCoachFeedback = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { sessionId, performanceRating, strengths, areasForImprovement, comments } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    const feedback = {
      sessionId,
      performanceRating,
      strengths,
      areasForImprovement,
      comments,
      date: new Date()
    };

    enrollment.coachFeedback.push(feedback);
    await enrollment.save();

    // Send notification to student
    await Notification.createNotification({
      recipient: enrollment.user,
      title: 'New Coach Feedback',
      message: 'Your coach has provided feedback on your recent session.',
      type: 'coach_feedback',
      category: 'info',
      relatedModel: 'Enrollment',
      relatedId: enrollment._id,
      actionUrl: `/dashboard/feedback`,
      deliveryChannels: [{ channel: 'in_app' }]
    });

    res.json({
      success: true,
      message: 'Feedback added successfully',
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding feedback',
      error: error.message
    });
  }
};

// Cancel enrollment
const cancelEnrollment = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { reason } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId)
      .populate('program');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    if (enrollment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed enrollment'
      });
    }

    // Update enrollment status
    enrollment.status = 'cancelled';
    enrollment.notes = reason;
    await enrollment.save();

    // Update program enrollment count
    await CoachingProgram.findByIdAndUpdate(enrollment.program._id, {
      $inc: { currentEnrollments: -1 }
    });

    // Process refund if payment was completed
    if (enrollment.paymentStatus === 'completed') {
      const payment = await Payment.findById(enrollment.paymentId);
      if (payment) {
        payment.status = 'refunded';
        payment.refunds.push({
          amount: payment.amount,
          reason: reason || 'Enrollment cancelled',
          refundDate: new Date(),
          status: 'pending'
        });
        await payment.save();
      }
    }

    // Send notification
    await Notification.createNotification({
      recipient: enrollment.user,
      title: 'Enrollment Cancelled',
      message: `Your enrollment for "${enrollment.program.title}" has been cancelled.`,
      type: 'general',
      category: 'info',
      relatedModel: 'Enrollment',
      relatedId: enrollment._id,
      deliveryChannels: [{ channel: 'in_app' }, { channel: 'email' }]
    });

    res.json({
      success: true,
      message: 'Enrollment cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling enrollment',
      error: error.message
    });
  }
};

// Generate certificate
const generateCertificate = async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    const enrollment = await Enrollment.findById(enrollmentId)
      .populate('program')
      .populate('user')
      .populate({
        path: 'program',
        populate: {
          path: 'coach',
          populate: {
            path: 'userId'
          }
        }
      });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    if (!enrollment.certificateEligible || enrollment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Not eligible for certificate'
      });
    }

    if (enrollment.certificateIssued) {
      return res.status(400).json({
        success: false,
        message: 'Certificate already issued'
      });
    }

    // Create certificate
    const certificate = new Certificate({
      user: enrollment.user._id,
      enrollment: enrollment._id,
      program: enrollment.program._id,
      coach: enrollment.program.coach._id,
      title: enrollment.program.title,
      description: `Certificate of completion for ${enrollment.program.title}`,
      completionDetails: {
        startDate: enrollment.enrollmentDate,
        endDate: new Date(),
        totalSessions: enrollment.progress.totalSessions,
        attendedSessions: enrollment.progress.completedSessions,
        attendancePercentage: Math.round((enrollment.progress.completedSessions / enrollment.progress.totalSessions) * 100),
        skillAssessments: enrollment.progress.skillAssessments
      }
    });

    await certificate.save();

    // Update enrollment
    enrollment.certificateIssued = true;
    enrollment.certificateId = certificate._id;
    await enrollment.save();

    // Send notification
    await Notification.createNotification({
      recipient: enrollment.user._id,
      title: 'Certificate Ready!',
      message: `Your certificate for "${enrollment.program.title}" is ready for download.`,
      type: 'certificate_ready',
      category: 'success',
      relatedModel: 'Certificate',
      relatedId: certificate._id,
      actionUrl: `/certificates/${certificate._id}`,
      deliveryChannels: [{ channel: 'in_app' }, { channel: 'email' }]
    });

    res.json({
      success: true,
      message: 'Certificate generated successfully',
      data: certificate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating certificate',
      error: error.message
    });
  }
};

module.exports = {
  createEnrollment,
  confirmPayment,
  getUserEnrollments,
  getEnrollmentById,
  updateProgress,
  addCoachFeedback,
  cancelEnrollment,
  generateCertificate
};
