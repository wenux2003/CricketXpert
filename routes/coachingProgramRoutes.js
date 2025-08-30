const express = require('express');
const router = express.Router();
const {
  getAllPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  addMaterial,
  removeMaterial,
  getProgramEnrollments,
  getProgramStats
} = require('../controllers/coachingProgramController');

// @route   GET /api/coaching-programs
// @desc    Get all coaching programs with filters
// @access  Public
router.get('/', getAllPrograms);

// @route   GET /api/coaching-programs/:id
// @desc    Get coaching program by ID
// @access  Public
router.get('/:id', getProgramById);

// @route   POST /api/coaching-programs
// @desc    Create new coaching program
// @access  Private (Coach Manager only)
router.post('/', createProgram);

// @route   PUT /api/coaching-programs/:id
// @desc    Update coaching program
// @access  Private (Coach Manager or assigned Coach)
router.put('/:id', updateProgram);

// @route   DELETE /api/coaching-programs/:id
// @desc    Delete coaching program (soft delete)
// @access  Private (Coach Manager only)
router.delete('/:id', deleteProgram);

// @route   POST /api/coaching-programs/:id/materials
// @desc    Add material to program
// @access  Private (Coach Manager or assigned Coach)
router.post('/:id/materials', addMaterial);

// @route   DELETE /api/coaching-programs/:programId/materials/:materialId
// @desc    Remove material from program
// @access  Private (Coach Manager or assigned Coach)
router.delete('/:programId/materials/:materialId', removeMaterial);

// @route   GET /api/coaching-programs/:id/enrollments
// @desc    Get program enrollments
// @access  Private (Coach Manager or assigned Coach)
router.get('/:id/enrollments', getProgramEnrollments);

// @route   GET /api/coaching-programs/:id/stats
// @desc    Get program statistics
// @access  Private (Coach Manager or assigned Coach)
router.get('/:id/stats', getProgramStats);

module.exports = router;
