const Feedback = require('../models/Feedback');

// 1. Submit feedback
exports.createFeedback = async (req, res) => {
  try {
    const { requestId, requestType, customerId, description, category } = req.body;

    const feedback = await Feedback.create({
      requestId,
      requestType,
      customerId,
      description,
      category
    });

    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Get all feedbacks
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('customerId', 'username email');
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Update feedback status or response
exports.updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response } = req.body;

    const feedback = await Feedback.findById(id);
    if (!feedback) return res.status(404).json({ error: 'Feedback not found' });

    if (status) feedback.status = status;
    if (response) feedback.response = response;

    await feedback.save();
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Delete feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Feedback.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Feedback not found' });
    res.json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
