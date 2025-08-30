const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const Enrollment = require('../models/Enrollment');
const Session = require('../models/Session');
const mongoose = require('mongoose');

// @route   POST /api/feedbacks
// @desc    Create feedback for session/program
// @access  Private (Customer)
router.post('/', async (req, res) => {
  try {
    const {
      sessionId,
      enrollmentId,
      rating,
      comment,
      categories,
      isAnonymous = false
    } = req.body;
    const userId = req.user?.id; // Assuming middleware sets req.user

    // Verify user is enrolled if enrollmentId provided
    if (enrollmentId) {
      const enrollment = await Enrollment.findOne({
        _id: enrollmentId,
        user: userId
      });
      if (!enrollment) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to provide feedback for this enrollment'
        });
      }
    }

    // Verify user attended session if sessionId provided
    if (sessionId) {
      const session = await Session.findOne({
        _id: sessionId,
        'participants.user': userId,
        'participants.attended': true
      });
      if (!session) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to provide feedback for this session'
        });
      }
    }

    const feedback = new Feedback({
      user: isAnonymous ? null : userId,
      session: sessionId,
      enrollment: enrollmentId,
      rating,
      comment,
      categories: categories || [],
      isAnonymous
    });

    await feedback.save();

    // Update enrollment feedback if applicable
    if (enrollmentId && sessionId) {
      await Enrollment.findByIdAndUpdate(enrollmentId, {
        $push: {
          feedback: {
            sessionId,
            rating,
            comment,
            date: new Date()
          }
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback',
      error: error.message
    });
  }
});

// @route   GET /api/feedbacks
// @desc    Get feedbacks with filters
// @access  Private (Coach/Admin)
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      session,
      enrollment,
      coach,
      program,
      minRating,
      maxRating
    } = req.query;

    const filter = {};
    if (session) filter.session = session;
    if (enrollment) filter.enrollment = enrollment;
    if (minRating) filter.rating = { ...filter.rating, $gte: parseInt(minRating) };
    if (maxRating) filter.rating = { ...filter.rating, $lte: parseInt(maxRating) };

    let aggregationPipeline = [{ $match: filter }];

    // Filter by coach or program if provided
    if (coach || program) {
      aggregationPipeline.push(
        {
          $lookup: {
            from: 'enrollments',
            localField: 'enrollment',
            foreignField: '_id',
            as: 'enrollmentData'
          }
        },
        {
          $lookup: {
            from: 'coachingprograms',
            localField: 'enrollmentData.program',
            foreignField: '_id',
            as: 'programData'
          }
        }
      );

      if (coach) {
        aggregationPipeline.push({
          $match: { 'programData.coach': mongoose.Types.ObjectId(coach) }
        });
      }

      if (program) {
        aggregationPipeline.push({
          $match: { 'programData._id': mongoose.Types.ObjectId(program) }
        });
      }
    }

    // Add pagination
    aggregationPipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) }
    );

    // Populate data
    aggregationPipeline.push(
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userData'
        }
      },
      {
        $lookup: {
          from: 'sessions',
          localField: 'session',
          foreignField: '_id',
          as: 'sessionData'
        }
      }
    );

    const feedbacks = await Feedback.aggregate(aggregationPipeline);
    const totalFeedbacks = await Feedback.countDocuments(filter);

    res.json({
      success: true,
      data: feedbacks,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalFeedbacks / parseInt(limit)),
        totalFeedbacks
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching feedbacks',
      error: error.message
    });
  }
});

// @route   GET /api/feedbacks/:id
// @desc    Get feedback by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('user', 'firstName lastName')
      .populate('session', 'title scheduledDate')
      .populate({
        path: 'enrollment',
        populate: {
          path: 'program',
          select: 'title'
        }
      });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.json({
      success: true,
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback',
      error: error.message
    });
  }
});

// @route   PUT /api/feedbacks/:id
// @desc    Update feedback
// @access  Private (User who created it)
router.put('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Check if user owns the feedback (unless anonymous)
    if (feedback.user && feedback.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this feedback'
      });
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Feedback updated successfully',
      data: updatedFeedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating feedback',
      error: error.message
    });
  }
});

// @route   DELETE /api/feedbacks/:id
// @desc    Delete feedback
// @access  Private (User who created it or Admin)
router.delete('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Check authorization
    const isOwner = feedback.user && feedback.user.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this feedback'
      });
    }

    await Feedback.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting feedback',
      error: error.message
    });
  }
});

// @route   GET /api/feedbacks/stats/summary
// @desc    Get feedback statistics
// @access  Private (Coach/Admin)
router.get('/stats/summary', async (req, res) => {
  try {
    const { coach, program, startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    let pipeline = [{ $match: dateFilter }];

    // Filter by coach or program
    if (coach || program) {
      pipeline.push(
        {
          $lookup: {
            from: 'enrollments',
            localField: 'enrollment',
            foreignField: '_id',
            as: 'enrollmentData'
          }
        },
        {
          $lookup: {
            from: 'coachingprograms',
            localField: 'enrollmentData.program',
            foreignField: '_id',
            as: 'programData'
          }
        }
      );

      if (coach) {
        pipeline.push({
          $match: { 'programData.coach': mongoose.Types.ObjectId(coach) }
        });
      }

      if (program) {
        pipeline.push({
          $match: { 'programData._id': mongoose.Types.ObjectId(program) }
        });
      }
    }

    // Calculate statistics
    pipeline.push(
      {
        $group: {
          _id: null,
          totalFeedbacks: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    );

    const stats = await Feedback.aggregate(pipeline);
    const result = stats[0] || {
      totalFeedbacks: 0,
      averageRating: 0,
      ratingDistribution: []
    };

    // Calculate rating distribution
    const distribution = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };
    
    result.ratingDistribution.forEach(rating => {
      distribution[rating] = (distribution[rating] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        ...result,
        ratingDistribution: distribution
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback statistics',
      error: error.message
    });
  }
});

module.exports = router;
