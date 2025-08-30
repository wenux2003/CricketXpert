const Coach = require('../models/Coach');
const User = require('../models/User');
const CoachingProgram = require('../models/CoachingProgram');
const Enrollment = require('../models/Enrollment');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

// Get all coaches with filters and pagination
const getAllCoaches = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      specialization,
      minRating,
      maxRate,
      isActive = true,
      search
    } = req.query;

    // Build filter object
    const filter = { isActive };
    
    if (specialization) {
      filter.specializations = { $in: [specialization] };
    }
    
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }
    
    if (maxRate) {
      filter.hourlyRate = { $lte: parseFloat(maxRate) };
    }

    // Create aggregation pipeline for search
    let pipeline = [
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $match: filter }
    ];

    // Add search functionality
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'user.firstName': { $regex: search, $options: 'i' } },
            { 'user.lastName': { $regex: search, $options: 'i' } },
            { bio: { $regex: search, $options: 'i' } },
            { specializations: { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    // Add sorting and pagination
    pipeline.push(
      { $sort: { rating: -1, createdAt: -1 } },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) }
    );

    const coaches = await Coach.aggregate(pipeline);
    const totalCoaches = await Coach.countDocuments(filter);

    res.json({
      success: true,
      data: coaches,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCoaches / parseInt(limit)),
        totalCoaches,
        hasNextPage: page * limit < totalCoaches,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching coaches',
      error: error.message
    });
  }
};

// Get coach by ID
const getCoachById = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id)
      .populate('userId', 'firstName lastName email contactNumber profileImageURL')
      .populate('assignedPrograms');

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    res.json({
      success: true,
      data: coach
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching coach',
      error: error.message
    });
  }
};

// Create new coach
const createCoach = async (req, res) => {
  try {
    const {
      userId,
      specializations,
      experience,
      certifications,
      bio,
      hourlyRate,
      availability,
      achievements,
      profileImage
    } = req.body;

    // Check if user exists and has coach role
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role !== 'coach') {
      return res.status(400).json({
        success: false,
        message: 'User must have coach role'
      });
    }

    // Check if coach profile already exists for this user
    const existingCoach = await Coach.findOne({ userId });
    if (existingCoach) {
      return res.status(400).json({
        success: false,
        message: 'Coach profile already exists for this user'
      });
    }

    const newCoach = new Coach({
      userId,
      specializations,
      experience,
      certifications,
      bio,
      hourlyRate,
      availability,
      achievements,
      profileImage
    });

    await newCoach.save();

    // Populate user data for response
    await newCoach.populate('userId', 'firstName lastName email contactNumber');

    // Send notification to admin about new coach registration
    await Notification.createNotification({
      recipient: user._id, // You might want to send this to admin instead
      title: 'Coach Profile Created',
      message: 'Your coach profile has been successfully created and is now active.',
      type: 'general',
      category: 'success',
      deliveryChannels: [{ channel: 'in_app' }]
    });

    res.status(201).json({
      success: true,
      message: 'Coach created successfully',
      data: newCoach
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating coach',
      error: error.message
    });
  }
};

// Update coach
const updateCoach = async (req, res) => {
  try {
    const coachId = req.params.id;
    const updateData = req.body;

    // Don't allow updating userId
    delete updateData.userId;

    const coach = await Coach.findByIdAndUpdate(
      coachId,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'firstName lastName email contactNumber');

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    res.json({
      success: true,
      message: 'Coach updated successfully',
      data: coach
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating coach',
      error: error.message
    });
  }
};

// Delete coach (soft delete by setting isActive to false)
const deleteCoach = async (req, res) => {
  try {
    const coachId = req.params.id;

    // Check if coach has active programs
    const activePrograms = await CoachingProgram.countDocuments({
      coach: coachId,
      isActive: true,
      endDate: { $gte: new Date() }
    });

    if (activePrograms > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete coach with active programs. Please complete or transfer programs first.'
      });
    }

    const coach = await Coach.findByIdAndUpdate(
      coachId,
      { isActive: false },
      { new: true }
    );

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    res.json({
      success: true,
      message: 'Coach deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting coach',
      error: error.message
    });
  }
};

// Get coach statistics
const getCoachStats = async (req, res) => {
  try {
    const coachId = req.params.id;

    const stats = await Coach.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(coachId) } },
      {
        $lookup: {
          from: 'coachingprograms',
          localField: '_id',
          foreignField: 'coach',
          as: 'programs'
        }
      },
      {
        $lookup: {
          from: 'enrollments',
          localField: 'programs._id',
          foreignField: 'program',
          as: 'enrollments'
        }
      },
      {
        $project: {
          totalPrograms: { $size: '$programs' },
          activePrograms: {
            $size: {
              $filter: {
                input: '$programs',
                cond: { $eq: ['$$this.isActive', true] }
              }
            }
          },
          totalStudents: { $size: '$enrollments' },
          completedEnrollments: {
            $size: {
              $filter: {
                input: '$enrollments',
                cond: { $eq: ['$$this.status', 'completed'] }
              }
            }
          },
          rating: 1,
          totalReviews: 1,
          specializations: 1,
          experience: 1
        }
      }
    ]);

    if (stats.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching coach statistics',
      error: error.message
    });
  }
};

// Update coach availability
const updateAvailability = async (req, res) => {
  try {
    const coachId = req.params.id;
    const { availability } = req.body;

    const coach = await Coach.findByIdAndUpdate(
      coachId,
      { availability },
      { new: true, runValidators: true }
    );

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    res.json({
      success: true,
      message: 'Availability updated successfully',
      data: { availability: coach.availability }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating availability',
      error: error.message
    });
  }
};

// Get coach's assigned programs
const getCoachPrograms = async (req, res) => {
  try {
    const coachId = req.params.id;
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { coach: coachId };
    if (status) {
      filter.isActive = status === 'active';
    }

    const programs = await CoachingProgram.find(filter)
      .populate('coach', 'userId specializations')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalPrograms = await CoachingProgram.countDocuments(filter);

    res.json({
      success: true,
      data: programs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalPrograms / parseInt(limit)),
        totalPrograms
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching coach programs',
      error: error.message
    });
  }
};

module.exports = {
  getAllCoaches,
  getCoachById,
  createCoach,
  updateCoach,
  deleteCoach,
  getCoachStats,
  updateAvailability,
  getCoachPrograms
};
