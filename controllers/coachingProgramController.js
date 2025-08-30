const CoachingProgram = require('../models/CoachingProgram');
const Coach = require('../models/Coach');
const Enrollment = require('../models/Enrollment');
const Session = require('../models/Session');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

// Get all coaching programs with filters
const getAllPrograms = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      specialization,
      coach,
      isActive = true,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: isActive === 'true' };
    
    if (category) filter.category = category;
    if (specialization) filter.specialization = specialization;
    if (coach) filter.coach = coach;

    // Build query
    let query = CoachingProgram.find(filter);

    // Add search functionality
    if (search) {
      query = query.find({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } }
        ]
      });
    }

    // Add sorting
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;
    query = query.sort(sortObj);

    // Add population
    query = query.populate('coach', 'userId specializations rating totalReviews');

    // Execute query with pagination
    const programs = await query
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalPrograms = await CoachingProgram.countDocuments(filter);

    res.json({
      success: true,
      data: programs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalPrograms / parseInt(limit)),
        totalPrograms,
        hasNextPage: page * limit < totalPrograms,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching programs',
      error: error.message
    });
  }
};

// Get program by ID
const getProgramById = async (req, res) => {
  try {
    const program = await CoachingProgram.findById(req.params.id)
      .populate({
        path: 'coach',
        populate: {
          path: 'userId',
          select: 'firstName lastName email profileImageURL'
        }
      });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    // Get enrollment count and availability
    const enrollmentCount = await Enrollment.countDocuments({
      program: program._id,
      status: { $in: ['active', 'pending'] }
    });

    const responseData = {
      ...program.toObject(),
      availableSpots: program.maxParticipants - enrollmentCount,
      enrollmentCount
    };

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching program',
      error: error.message
    });
  }
};

// Create new program
const createProgram = async (req, res) => {
  try {
    const {
      title,
      description,
      coach,
      category,
      specialization,
      duration,
      price,
      maxParticipants,
      materials,
      curriculum,
      requirements,
      benefits,
      startDate,
      endDate,
      imageUrl,
      tags,
      difficulty
    } = req.body;

    // Verify coach exists
    const coachExists = await Coach.findById(coach);
    if (!coachExists) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    // Calculate total sessions
    const totalSessions = duration.weeks * duration.sessionsPerWeek;

    const newProgram = new CoachingProgram({
      title,
      description,
      coach,
      category,
      specialization,
      duration,
      totalSessions,
      price,
      maxParticipants,
      materials: materials || [],
      curriculum: curriculum || [],
      requirements: requirements || [],
      benefits: benefits || [],
      startDate,
      endDate,
      imageUrl,
      tags: tags || [],
      difficulty
    });

    await newProgram.save();

    // Add program to coach's assigned programs
    await Coach.findByIdAndUpdate(coach, {
      $addToSet: { assignedPrograms: newProgram._id }
    });

    // Populate coach data for response
    await newProgram.populate({
      path: 'coach',
      populate: {
        path: 'userId',
        select: 'firstName lastName'
      }
    });

    // Send notification to coach
    await Notification.createNotification({
      recipient: coachExists.userId,
      title: 'New Program Assigned',
      message: `You have been assigned to a new coaching program: ${title}`,
      type: 'general',
      category: 'info',
      relatedModel: 'CoachingProgram',
      relatedId: newProgram._id,
      actionUrl: `/programs/${newProgram._id}`,
      deliveryChannels: [{ channel: 'in_app' }, { channel: 'email' }]
    });

    res.status(201).json({
      success: true,
      message: 'Program created successfully',
      data: newProgram
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating program',
      error: error.message
    });
  }
};

// Update program
const updateProgram = async (req, res) => {
  try {
    const programId = req.params.id;
    const updateData = req.body;

    // If duration is updated, recalculate total sessions
    if (updateData.duration) {
      updateData.totalSessions = updateData.duration.weeks * updateData.duration.sessionsPerWeek;
    }

    const program = await CoachingProgram.findByIdAndUpdate(
      programId,
      updateData,
      { new: true, runValidators: true }
    ).populate({
      path: 'coach',
      populate: {
        path: 'userId',
        select: 'firstName lastName'
      }
    });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    // If program details are significantly updated, notify enrolled students
    if (updateData.startDate || updateData.endDate || updateData.curriculum) {
      const enrollments = await Enrollment.find({
        program: programId,
        status: { $in: ['active', 'pending'] }
      });

      for (const enrollment of enrollments) {
        await Notification.createNotification({
          recipient: enrollment.user,
          title: 'Program Updated',
          message: `The coaching program "${program.title}" has been updated. Please review the changes.`,
          type: 'general',
          category: 'info',
          relatedModel: 'CoachingProgram',
          relatedId: programId,
          actionUrl: `/programs/${programId}`,
          deliveryChannels: [{ channel: 'in_app' }]
        });
      }
    }

    res.json({
      success: true,
      message: 'Program updated successfully',
      data: program
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating program',
      error: error.message
    });
  }
};

// Delete program (soft delete)
const deleteProgram = async (req, res) => {
  try {
    const programId = req.params.id;

    // Check if program has active enrollments
    const activeEnrollments = await Enrollment.countDocuments({
      program: programId,
      status: { $in: ['active', 'pending'] }
    });

    if (activeEnrollments > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete program with active enrollments'
      });
    }

    const program = await CoachingProgram.findByIdAndUpdate(
      programId,
      { isActive: false },
      { new: true }
    );

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    // Remove program from coach's assigned programs
    await Coach.findByIdAndUpdate(program.coach, {
      $pull: { assignedPrograms: programId }
    });

    res.json({
      success: true,
      message: 'Program deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting program',
      error: error.message
    });
  }
};

// Add material to program
const addMaterial = async (req, res) => {
  try {
    const programId = req.params.id;
    const { title, type, url, description } = req.body;

    const material = {
      title,
      type,
      url,
      description,
      uploadDate: new Date()
    };

    const program = await CoachingProgram.findByIdAndUpdate(
      programId,
      { $push: { materials: material } },
      { new: true }
    );

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    // Notify enrolled students about new material
    const enrollments = await Enrollment.find({
      program: programId,
      status: 'active'
    });

    for (const enrollment of enrollments) {
      await Notification.createNotification({
        recipient: enrollment.user,
        title: 'New Material Added',
        message: `New material "${title}" has been added to ${program.title}`,
        type: 'general',
        category: 'info',
        relatedModel: 'CoachingProgram',
        relatedId: programId,
        actionUrl: `/programs/${programId}/materials`,
        deliveryChannels: [{ channel: 'in_app' }]
      });
    }

    res.json({
      success: true,
      message: 'Material added successfully',
      data: program.materials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding material',
      error: error.message
    });
  }
};

// Remove material from program
const removeMaterial = async (req, res) => {
  try {
    const { programId, materialId } = req.params;

    const program = await CoachingProgram.findByIdAndUpdate(
      programId,
      { $pull: { materials: { _id: materialId } } },
      { new: true }
    );

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    res.json({
      success: true,
      message: 'Material removed successfully',
      data: program.materials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing material',
      error: error.message
    });
  }
};

// Get program enrollments
const getProgramEnrollments = async (req, res) => {
  try {
    const programId = req.params.id;
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { program: programId };
    if (status) {
      filter.status = status;
    }

    const enrollments = await Enrollment.find(filter)
      .populate('user', 'firstName lastName email contactNumber')
      .populate('program', 'title')
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
      message: 'Error fetching program enrollments',
      error: error.message
    });
  }
};

// Get program statistics
const getProgramStats = async (req, res) => {
  try {
    const programId = req.params.id;

    const stats = await Enrollment.aggregate([
      { $match: { program: mongoose.Types.ObjectId(programId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgProgress: { $avg: '$progress.progressPercentage' }
        }
      }
    ]);

    const totalEnrollments = await Enrollment.countDocuments({ program: programId });
    const completedEnrollments = await Enrollment.countDocuments({
      program: programId,
      status: 'completed'
    });
    
    const program = await CoachingProgram.findById(programId);
    const availableSpots = program ? program.maxParticipants - program.currentEnrollments : 0;

    res.json({
      success: true,
      data: {
        totalEnrollments,
        completedEnrollments,
        availableSpots,
        maxParticipants: program?.maxParticipants || 0,
        completionRate: totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0,
        statusBreakdown: stats,
        revenue: completedEnrollments * (program?.price || 0)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching program statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  addMaterial,
  removeMaterial,
  getProgramEnrollments,
  getProgramStats
};
