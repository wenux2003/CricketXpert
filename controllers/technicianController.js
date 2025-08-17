const Technician = require('../models/Technician');

// 1. Create technician
exports.createTechnician = async (req, res) => {
  try {
    const { technicianId, skills, available } = req.body;
    const technician = await Technician.create({ technicianId, skills, available });
    res.status(201).json(technician);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Get all technicians
exports.getAllTechnicians = async (req, res) => {
  try {
    const technicians = await Technician.find().populate('technicianId', 'username email');
    res.json(technicians);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get technician by ID
exports.getTechnicianById = async (req, res) => {
  try {
    const { id } = req.params;
    const technician = await Technician.findById(id).populate('technicianId', 'username email');
    if (!technician) return res.status(404).json({ error: 'Technician not found' });
    res.json(technician);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Update technician info
exports.updateTechnician = async (req, res) => {
  try {
    const { id } = req.params;
    const { skills, available } = req.body;

    const technician = await Technician.findById(id);
    if (!technician) return res.status(404).json({ error: 'Technician not found' });

    if (skills) technician.skills = skills;
    if (available !== undefined) technician.available = available;

    await technician.save();
    res.json(technician);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Delete technician
exports.deleteTechnician = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Technician.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Technician not found' });
    res.json({ message: 'Technician deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
