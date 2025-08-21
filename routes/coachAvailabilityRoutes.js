const express = require('express');
const router = express.Router();
const coachAvailabilityController = require('../controllers/coachAvailabilityController');

// CREATE
router.post('/', coachAvailabilityController.createAvailability);

// READ
router.get('/', coachAvailabilityController.getAllAvailabilities);
router.get('/:id', coachAvailabilityController.getAvailabilityById);

// UPDATE
router.put('/:id', coachAvailabilityController.updateAvailability);

// DELETE
router.delete('/:id', coachAvailabilityController.deleteAvailability);

module.exports = router;
