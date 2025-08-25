const MCoachingProgram = require('../models/MCoachingProgram');

// Create a new coaching program
exports.createCoachingProgram = async (req, res) => {
  try {
    const program = new MCoachingProgram(req.body);
    const savedProgram = await program.save();
    res.status(201).json(savedProgram);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all coaching programs (with optional filtering)
exports.getAllCoachingPrograms = async (req, res) => {
  try {
    const filter = {};
    if (req.query.isActive) filter.isActive = req.query.isActive === 'true';
    const programs = await MCoachingProgram.find(filter).populate('coachId');
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single coaching program by ID
exports.getCoachingProgramById = async (req, res) => {
  try {
    const program = await MCoachingProgram.findById(req.params.id).populate('coachId');
    if (!program) {
      return res.status(404).json({ message: 'Coaching program not found' });
    }
    res.json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a coaching program by ID
exports.updateCoachingProgram = async (req, res) => {
  try {
    const program = await MCoachingProgram.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!program) {
      return res.status(404).json({ message: 'Coaching program not found' });
    }
    res.json(program);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a coaching program by ID
exports.deleteCoachingProgram = async (req, res) => {
  try {
    const program = await MCoachingProgram.findByIdAndDelete(req.params.id);
    if (!program) {
      return res.status(404).json({ message: 'Coaching program not found' });
    }
    res.json({ message: 'Coaching program deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
