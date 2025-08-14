const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Create a new feedback/complaint (customer)
router.post('/', feedbackController.createFeedback);

// Get all feedbacks (service manager)
router.get('/', feedbackController.getAllFeedback);

// Update feedback status or response (service manager)
router.put('/:id', feedbackController.updateFeedback);

// Delete a feedback
router.delete('/:id', feedbackController.deleteFeedback);

module.exports = router;
