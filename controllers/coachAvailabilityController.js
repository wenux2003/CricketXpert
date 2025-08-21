const CoachAvailability = require('../models/CoachAvailability');

// CREATE new coach availability
const createAvailability = async (req, res) => {
  try {
    const { coach, date, slots, overriddenByManager } = req.body;

    const newAvailability = new CoachAvailability({
      coach,
      date,
      slots,
      overriddenByManager
    });

    await newAvailability.save();
    res.status(201).json({ message: 'Coach availability created successfully', availability: newAvailability });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create coach availability', error: error.message });
  }
};

// READ all availabilities
const getAllAvailabilities = async (req, res) => {
  try {
    const availabilities = await CoachAvailability.find().populate('coach', 'username email role');
    res.status(200).json(availabilities);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch availabilities', error: error.message });
  }
};

// READ availability by ID
const getAvailabilityById = async (req, res) => {
  try {
    const availability = await CoachAvailability.findById(req.params.id).populate('coach', 'username email role');
    if (!availability) {
      return res.status(404).json({ message: 'Availability not found' });
    }
    res.status(200).json(availability);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch availability', error: error.message });
  }
};

// UPDATE availability by ID
const updateAvailability = async (req, res) => {
  try {
    const updatedAvailability = await CoachAvailability.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedAvailability) {
      return res.status(404).json({ message: 'Availability not found' });
    }

    res.status(200).json({ message: 'Availability updated successfully', availability: updatedAvailability });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update availability', error: error.message });
  }
};

// DELETE availability by ID
const deleteAvailability = async (req, res) => {
  try {
    const deletedAvailability = await CoachAvailability.findByIdAndDelete(req.params.id);
    if (!deletedAvailability) {
      return res.status(404).json({ message: 'Availability not found' });
    }
    res.status(200).json({ message: 'Availability deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete availability', error: error.message });
  }
};

module.exports = {
  createAvailability,
  getAllAvailabilities,
  getAvailabilityById,
  updateAvailability,
  deleteAvailability
};
