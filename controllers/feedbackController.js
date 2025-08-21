const Coach_Feedback = require('../models/Feedback');

// Create a new feedback
exports.createFeedback = async (req, res) => {
  try {
    const feedback = new Coach_Feedback(req.body);
    const savedFeedback = await feedback.save();
    res.status(201).json(savedFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all feedbacks (optional filtering by type, from, to, or program)
exports.getAllFeedbacks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.from) filter.from = req.query.from;
    if (req.query.to) filter.to = req.query.to;
    if (req.query.program) filter.program = req.query.program;

    const feedbacks = await Coach_Feedback.find(filter)
      .populate('from')
      .populate('to')
      .populate('program');
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single feedback by ID
exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Coach_Feedback.findById(req.params.id)
      .populate('from')
      .populate('to')
      .populate('program');
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update feedback by ID
exports.updateFeedback = async (req, res) => {
  try {
    const feedback = await Coach_Feedback.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.json(feedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete feedback by ID
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Coach_Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
