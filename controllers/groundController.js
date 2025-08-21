const MGround = require('../models/Ground');

// Create a new ground
exports.createGround = async (req, res) => {
  try {
    const ground = new MGround(req.body);
    const savedGround = await ground.save();
    res.status(201).json(savedGround);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all grounds
exports.getAllGrounds = async (req, res) => {
  try {
    const grounds = await MGround.find();
    res.json(grounds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single ground by ID
exports.getGroundById = async (req, res) => {
  try {
    const ground = await MGround.findById(req.params.id);
    if (!ground) {
      return res.status(404).json({ message: 'Ground not found' });
    }
    res.json(ground);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a ground by ID
exports.updateGround = async (req, res) => {
  try {
    const ground = await MGround.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!ground) {
      return res.status(404).json({ message: 'Ground not found' });
    }
    res.json(ground);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a ground by ID
exports.deleteGround = async (req, res) => {
  try {
    const ground = await MGround.findByIdAndDelete(req.params.id);
    if (!ground) {
      return res.status(404).json({ message: 'Ground not found' });
    }
    res.json({ message: 'Ground deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
