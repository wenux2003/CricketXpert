const Coach = require('../models/Coach');
const User = require("../models/User"); // 👈 make sure you have this

// Get all coaches
const getAllCoaches = async (req, res, next) => {

  let coaches;
  try {
    coaches = await Coach.find(); // 👈 populates User details
    } catch (err) {
        console.log(err);
    }

    if (!coaches || coaches.length === 0) {
        return res.status(404).json({ message: "No coaches found" });
    }
    //Display all users

    return res.status(200).json({ coaches });
};

// Get one coach by ID
const getCoachById = async (req, res ,next) => {
  const id = req.params.id;
      let coach;
  
      try {
           coach = await Coach.findById(id);
      } catch (err) {
          console.log("Error while finding user:", err.message);
          return res.status(500).json({ message: "Something went wrong", error: err.message });
      }
  
      if (!coach) {
          return res.status(404).json({ message: "coaches not found" });
      }
  
      return res.status(200).json({ coach });

    };

    //data insert
  const addCoach = async (req, res, next) => {
  const { CoachId, specialization, experienceYears, availability, progress, assignedSessions } = req.body;
  let coach;

  try {
    coach = new Coach({
      CoachId,
      specialization,
      experienceYears,
      availability,
      progress,
      assignedSessions
    });

    await coach.save();
  } catch (err) {
    console.log("Error while saving coach:", err.message);
    return res.status(500).json({ message: "Unable to add coach", error: err.message });
  }

  return res.status(201).json({ coach });
};

//Update Coach

const updateCoach = async (req, res, next) => {
  const id = req.params.id;
  const { CoachId, specialization, experienceYears, availability, progress, assignedSessions } = req.body;

  let coach;
  try {
    coach = await Coach.findByIdAndUpdate(
      id,
      { CoachId, specialization, experienceYears, availability, progress, assignedSessions },
      { new: true, runValidators: true } // return updated doc + validate schema
    );
  } catch (err) {
    console.log("Error while updating coach:", err.message);
    return res.status(500).json({ message: "Something went wrong", error: err.message });
  }

  if (!coach) {
    return res.status(404).json({ message: "Unable to update - coach not found" });
  }

  return res.status(200).json({ message: "Coach updated successfully", coach });
};

//delete Coach

const deleteCoach = async (req, res, next) => {
  const id = req.params.id;
  let coach;

  try {
    coach = await Coach.findByIdAndDelete(id);
  } catch (err) {
    console.log("Error while deleting coach:", err.message);
    return res.status(500).json({ message: "Something went wrong", error: err.message });
  }

  if (!coach) {
    return res.status(404).json({ message: "Unable to delete - coach not found" });
  }

  return res.status(200).json({ message: "Coach deleted successfully", coach });
};

// 📌 Filter coaches based on query params (specialization, exp, availability, user name)
const filterCoaches = async (req, res, next) => {
  const { specialization, minExperience, maxExperience, day, name } = req.query;

  let filter = {};

  // specialization filter
  if (specialization) {
    filter.specialization = specialization;
  }

  // experience range filter
  if (minExperience || maxExperience) {
    filter.experienceYears = {};
    if (minExperience) filter.experienceYears.$gte = Number(minExperience);
    if (maxExperience) filter.experienceYears.$lte = Number(maxExperience);
  }

  // availability filter
  if (day) {
    filter["availability.day"] = day;
  }

  try {
    let query = Coach.find(filter).populate("CoachId"); // 👈 populate User

    let coaches = await query;

    // 🔍 filter by user name if provided
    if (name) {
      coaches = coaches.filter((coach) =>
        coach.CoachId?.name?.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (!coaches || coaches.length === 0) {
      return res.status(404).json({ message: "No coaches found matching filters" });
    }

    return res.status(200).json({ coaches });
  } catch (err) {
    console.error("Error while filtering coaches:", err);
    return res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

exports.getAllCoaches = getAllCoaches;
exports.getCoachById = getCoachById;
exports.addCoach = addCoach;
exports.updateCoach = updateCoach;
exports.deleteCoach = deleteCoach;
exports.filterCoaches = filterCoaches;





