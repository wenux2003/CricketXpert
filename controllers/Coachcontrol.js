const Coach = require("../models/Coach");

// @desc    Get all coaches
// @route   GET /Coaches
// @access  Public (change to private if needed)
const getAllCoaches = async (req, res) => {
    try {
        const coaches = await Coach.find();

        if (!coaches || coaches.length === 0) {
            return res.status(404).json({ message: "No coaches found" });
        }

        res.status(200).json(coaches);
    } catch (error) {
        console.error("Error fetching coaches:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Create a new coach
// @route   POST /Coaches
// @access  Public (change to private if needed)
const createCoach = async (req, res) => {
    try {
        const newCoach = new Coach(req.body);
        const savedCoach = await newCoach.save();
        res.status(201).json(savedCoach);
    } catch (error) {
        console.error("Error creating coach:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get a single coach by ID
// @route   GET /Coaches/:id
// @access  Public
const getCoachById = async (req, res) => {
    try {
        const coach = await Coach.findById(req.params.id);

        if (!coach) {
            return res.status(404).json({ message: "Coach not found" });
        }

        res.status(200).json(coach);
    } catch (error) {
        console.error("Error fetching coach:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Update coach
// @route   PUT /Coaches/:id
// @access  Public (change to private if needed)
const updateCoach = async (req, res) => {
    try {
        const updatedCoach = await Coach.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedCoach) {
            return res.status(404).json({ message: "Coach not found" });
        }

        res.status(200).json(updatedCoach);
    } catch (error) {
        console.error("Error updating coach:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Delete coach
// @route   DELETE /Coaches/:id
// @access  Public (change to private if needed)
const deleteCoach = async (req, res) => {
    try {
        const deletedCoach = await Coach.findByIdAndDelete(req.params.id);

        if (!deletedCoach) {
            return res.status(404).json({ message: "Coach not found" });
        }

        res.status(200).json({ message: "Coach deleted successfully" });
    } catch (error) {
        console.error("Error deleting coach:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    getAllCoaches,
    createCoach,
    getCoachById,
    updateCoach,
    deleteCoach 
};
