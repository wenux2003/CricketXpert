const Enrollment = require('../models/Enrollment');
const Session = require('../models/Session');
const Certificate = require('../models/Certificate');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const CoachingProgram = require('../models/CoachingProgram');
const Coach = require('../models/Coach');
const mongoose = require('mongoose');

// Get user dashboard data
const getUserDashboard = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user enrollments with progress
    const enrollments = await Enrollment.find({
      user: userId,
      status: { $in: ['active', 'completed'] }
    })
    .populate('program', 'title description imageUrl category')
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
    .sort({ enrollmentDate: -1 });

    // Get upcoming sessions
    const upcomingSessions = await Session.find({
      'participants.user': userId,
      scheduledDate: { $gte: new Date() },
      status: 'scheduled'
    })
    .populate('program', 'title')
    .populate('ground', 'description')
    .populate({
      path: 'coach',
      populate: {
        path: 'userId',
        select: 'firstName lastName'
      }
    })
    .sort({ scheduledDate: 1, startTime: 1 })
    .limit(5);

    // Get recent sessions (last 5 attended)
    const recentSessions = await Session.find({
      'participants': {
        $elemMatch: {
          user: userId,
          attended: true
        }
      },
      status: 'completed'
    })
    .populate('program', 'title')
    .populate({
      path: 'coach',
      populate: {
        path: 'userId',
        select: 'firstName lastName'
      }
    })
    .sort({ scheduledDate: -1 })
    .limit(5);

    // Get certificates
    const certificates = await Certificate.find({
      user: userId,
      status: 'active'
    })
    .populate('program', 'title')
    .sort({ issueDate: -1 });

    // Get recent notifications
    const notifications = await Notification.find({
      recipient: userId,
      isRead: false
    })
    .sort({ createdAt: -1 })
    .limit(5);

    // Calculate statistics
    const stats = {
      totalEnrollments: enrollments.length,
      activeEnrollments: enrollments.filter(e => e.status === 'active').length,
      completedPrograms: enrollments.filter(e => e.status === 'completed').length,
      totalCertificates: certificates.length,
      upcomingSessionsCount: upcomingSessions.length,
      averageProgress: enrollments.length > 0 
        ? enrollments.reduce((sum, e) => sum + e.progress.progressPercentage, 0) / enrollments.length 
        : 0
    };

    // Get learning streak (consecutive days with sessions)
    const learningStreak = await calculateLearningStreak(userId);

    res.json({
      success: true,
      data: {
        stats,
        enrollments,
        upcomingSessions,
        recentSessions,
        certificates,
        notifications,
        learningStreak
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
};

// Get coach dashboard data
const getCoachDashboard = async (req, res) => {
  try {
    const { coachId } = req.params;

    // Get coach profile
    const coach = await Coach.findById(coachId)
      .populate('userId', 'firstName lastName email')
      .populate('assignedPrograms');

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    // Get upcoming sessions
    const upcomingSessions = await Session.find({
      coach: coachId,
      scheduledDate: { $gte: new Date() },
      status: 'scheduled'
    })
    .populate('program', 'title')
    .populate('ground', 'description')
    .sort({ scheduledDate: 1, startTime: 1 })
    .limit(10);

    // Get recent sessions
    const recentSessions = await Session.find({
      coach: coachId,
      status: 'completed'
    })
    .populate('program', 'title')
    .sort({ scheduledDate: -1 })
    .limit(5);

    // Get active enrollments for coach's programs
    const activeEnrollments = await Enrollment.find({
      program: { $in: coach.assignedPrograms },
      status: 'active'
    })
    .populate('user', 'firstName lastName')
    .populate('program', 'title')
    .sort({ enrollmentDate: -1 });

    // Get pending feedback requests (sessions without coach feedback)
    const pendingFeedback = await Session.find({
      coach: coachId,
      status: 'completed',
      actualEndTime: { $exists: true }
    })
    .populate('program', 'title')
    .populate('participants.user', 'firstName lastName')
    .sort({ scheduledDate: -1 })
    .limit(10);

    // Calculate statistics
    const stats = {
      totalPrograms: coach.assignedPrograms.length,
      totalStudents: activeEnrollments.length,
      upcomingSessionsCount: upcomingSessions.length,
      completedSessionsToday: await Session.countDocuments({
        coach: coachId,
        status: 'completed',
        scheduledDate: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }),
      rating: coach.rating,
      totalReviews: coach.totalReviews
    };

    // Get monthly session trends
    const monthlyTrend = await Session.aggregate([
      {
        $match: {
          coach: mongoose.Types.ObjectId(coachId),
          status: 'completed',
          scheduledDate: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$scheduledDate' },
            month: { $month: '$scheduledDate' }
          },
          sessionCount: { $sum: 1 },
          studentCount: { $sum: { $size: '$participants' } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        coach,
        stats,
        upcomingSessions,
        recentSessions,
        activeEnrollments,
        pendingFeedback,
        monthlyTrend
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching coach dashboard data',
      error: error.message
    });
  }
};

// Get admin dashboard data
const getAdminDashboard = async (req, res) => {
  try {
    // Overall statistics
    const stats = await Promise.all([
      Enrollment.countDocuments({ status: 'active' }),
      Session.countDocuments({ status: 'scheduled' }),
      Certificate.countDocuments({ status: 'active' }),
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, totalRevenue: { $sum: '$finalAmount' } } }
      ]),
      Coach.countDocuments({ isActive: true }),
      CoachingProgram.countDocuments({ isActive: true })
    ]);

    const [
      activeEnrollments,
      scheduledSessions,
      activeCertificates,
      revenueData,
      activeCoaches,
      activePrograms
    ] = stats;

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // Recent activities
    const recentEnrollments = await Enrollment.find()
      .populate('user', 'firstName lastName')
      .populate('program', 'title')
      .sort({ enrollmentDate: -1 })
      .limit(5);

    const recentPayments = await Payment.find({ status: 'completed' })
      .populate('user', 'firstName lastName')
      .populate('program', 'title')
      .sort({ paymentDate: -1 })
      .limit(5);

    // Monthly trends
    const monthlyEnrollments = await Enrollment.aggregate([
      {
        $match: {
          enrollmentDate: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$enrollmentDate' },
            month: { $month: '$enrollmentDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          status: 'completed',
          paymentDate: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
          }
        }
      },
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

    // Top performing programs
    const topPrograms = await Enrollment.aggregate([
      { $match: { status: { $in: ['active', 'completed'] } } },
      {
        $group: {
          _id: '$program',
          enrollmentCount: { $sum: 1 },
          completionRate: {
            $avg: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: 'coachingprograms',
          localField: '_id',
          foreignField: '_id',
          as: 'programData'
        }
      },
      { $unwind: '$programData' },
      { $sort: { enrollmentCount: -1 } },
      { $limit: 5 }
    ]);

    // Coach performance
    const coachPerformance = await Session.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$coach',
          sessionCount: { $sum: 1 },
          studentCount: { $sum: { $size: '$participants' } }
        }
      },
      {
        $lookup: {
          from: 'coaches',
          localField: '_id',
          foreignField: '_id',
          as: 'coachData'
        }
      },
      { $unwind: '$coachData' },
      {
        $lookup: {
          from: 'users',
          localField: 'coachData.userId',
          foreignField: '_id',
          as: 'userData'
        }
      },
      { $unwind: '$userData' },
      { $sort: { sessionCount: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          activeEnrollments,
          scheduledSessions,
          activeCertificates,
          totalRevenue,
          activeCoaches,
          activePrograms
        },
        recentActivities: {
          enrollments: recentEnrollments,
          payments: recentPayments
        },
        trends: {
          monthlyEnrollments,
          monthlyRevenue
        },
        performance: {
          topPrograms,
          coachPerformance
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin dashboard data',
      error: error.message
    });
  }
};

// Helper function to calculate learning streak
const calculateLearningStreak = async (userId) => {
  try {
    const sessions = await Session.find({
      'participants': {
        $elemMatch: {
          user: userId,
          attended: true
        }
      },
      status: 'completed'
    })
    .select('scheduledDate')
    .sort({ scheduledDate: -1 });

    if (sessions.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const sessionDates = sessions.map(session => {
      const date = new Date(session.scheduledDate);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    });

    const uniqueDates = [...new Set(sessionDates)].sort((a, b) => b - a);

    for (let i = 0; i < uniqueDates.length; i++) {
      const sessionDate = new Date(uniqueDates[i]);
      const daysDiff = Math.floor((currentDate - sessionDate) / (1000 * 60 * 60 * 24));

      if (i === 0 && daysDiff <= 1) {
        streak = 1;
        currentDate = sessionDate;
      } else if (daysDiff === 1) {
        streak++;
        currentDate = sessionDate;
      } else {
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error('Error calculating learning streak:', error);
    return 0;
  }
};

module.exports = {
  getUserDashboard,
  getCoachDashboard,
  getAdminDashboard
};
