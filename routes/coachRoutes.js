const express = require('express');
const router = express.Router();
const {
  getAllCoaches,
  getCoachById,
  createCoach,
  updateCoach,
  deleteCoach,
  getCoachStats,
  updateAvailability,
  getCoachPrograms
} = require('../controllers/coachController');

// @route   GET /api/coaches
// @desc    Get all coaches with filters and pagination
// @access  Public
router.get('/', getAllCoaches);

// @route   GET /api/coaches/:id
// @desc    Get coach by ID
// @access  Public
router.get('/:id', getCoachById);

// @route   POST /api/coaches
// @desc    Create new coach
// @access  Private (Coach Manager only)
router.post('/', createCoach);

// @route   PUT /api/coaches/:id
// @desc    Update coach
// @access  Private (Coach Manager or Coach themselves)
router.put('/:id', updateCoach);

// @route   DELETE /api/coaches/:id
// @desc    Delete coach (soft delete)
// @access  Private (Coach Manager only)
router.delete('/:id', deleteCoach);

// @route   GET /api/coaches/:id/stats
// @desc    Get coach statistics
// @access  Private (Coach Manager or Coach themselves)
router.get('/:id/stats', getCoachStats);

// @route   PUT /api/coaches/:id/availability
// @desc    Update coach availability
// @access  Private (Coach themselves)
router.put('/:id/availability', updateAvailability);

// @route   GET /api/coaches/:id/programs
// @desc    Get coach's assigned programs
// @access  Private (Coach themselves or Coach Manager)
router.get('/:id/programs', getCoachPrograms);

module.exports = router;
