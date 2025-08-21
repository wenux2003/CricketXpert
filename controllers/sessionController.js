const Session = require('../models/Session');

// Create a new session
exports.createSession = async (req, res) => {
  try {
    const session = new Session(req.body);
    const savedSession = await session.save();
    res.status(201).json(savedSession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all sessions (with optional filtering)
exports.getAllSessions = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.player) filter.player = req.query.player;
    if (req.query.coach) filter.coach = req.query.coach;
    if (req.query.program) filter.program = req.query.program;
    if (req.query.date) filter.date = new Date(req.query.date);

    const sessions = await Session.find(filter)
      .populate('enrollment')
      .populate('program')
      .populate('coach')
      .populate('player')
      .populate('ground');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single session by ID
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('enrollment')
      .populate('program')
      .populate('coach')
      .populate('player')
      .populate('ground');
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a session by ID
exports.updateSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a session by ID
exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
