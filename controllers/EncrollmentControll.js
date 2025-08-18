const Enrollment = require('../models/Enrollment');
const CoachingProgram = require("../models/CoachingProgram");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");

// Get all coaches
const getAllEncroll = async (req, res, next) => {

  let players;
  try {
    players = await players.find(); // 👈 populates User details
    } catch (err) {
        console.log(err);
    }

    if (!players || players.length === 0) {
        return res.status(404).json({ message: "No players found" });
    }
    //Display all users

    return res.status(200).json({ players });
};

// Get one player by ID
const getPlayerById = async (req, res ,next) => {
  const id = req.params.id;
      let players;
  
      try {
           players = await players.findById(id);
      } catch (err) {
          console.log("Error while finding user:", err.message);
          return res.status(500).json({ message: "Something went wrong", error: err.message });
      }
  
      if (!players) {
          return res.status(404).json({ message: "players not found" });
      }
  
      return res.status(200).json({ players });

    };

    //data insert
  const addEnrollment = async (req, res, next) => {
  const { CoachId, specialization, experienceYears, availability, progress, assignedSessions } = req.body;
  let player;

  try {
    player = new Coach({
      customerId,
      programId,
      electedSlot,
      status,
      paymentId,
      progress,
      timestamps
    });

    await player.save();
  } catch (err) {
    console.log("Error while saving enrollment:", err.message);
    return res.status(500).json({ message: "Unable to add enrollment", error: err.message });
  }

  return res.status(201).json({ player});
};

//Update Enrollment

const updateCEnrollment = async (req, res, next) => {
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
    return res.status(404).json({ message: "Unable to update - Enrollment not found" });
  }

  return res.status(200).json({ message: "Enrollment updated successfully", coach });
};

//delete Enrollment

const deleteEnrollment = async (req, res, next) => {
  const id = req.params.id;
  let player;

  try {
    player = await player.findByIdAndDelete(id);
  } catch (err) {
    console.log("Error while deleting enrollment:", err.message);
    return res.status(500).json({ message: "Something went wrong", error: err.message });
  }

  if (!player) {
    return res.status(404).json({ message: "Unable to delete - coach not found" });
  }

  return res.status(200).json({ message: "Enrollment deleted successfully", player });
};

// 📌 Filter Enrollments
const filterEnrollments = async (req, res) => {
  try {
    const { customerId, programId, status } = req.query;

    let filter = {};

    if (customerId) filter.customerId = customerId;
    if (programId) filter.programId = programId;
    if (status) filter.status = status;

    const enrollments = await Enrollment.find(filter)
      .populate("customerId", "name email")
      .populate("programId", "title fee duration")
      .populate("paymentId");

    if (!enrollments || enrollments.length === 0) {
      return res.status(404).json({ message: "No enrollments found" });
    }

    res.status(200).json({ enrollments });
  } catch (err) {
    console.error("Error filtering enrollments:", err.message);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};
// 📌 Download Certificate (only if completed)
const downloadCertificate = async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    const enrollment = await Enrollment.findById(enrollmentId)
      .populate("customerId", "name email")
      .populate("programId", "title certificateTemplate");

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    if (enrollment.status !== "completed") {
      return res.status(400).json({ message: "Certificate available only after completion" });
    }

    // Use the stored certificate template from CoachingProgram
    const templatePath = enrollment.programId.certificateTemplate;

    if (!templatePath || !fs.existsSync(path.join(__dirname, "../certificates", templatePath))) {
      return res.status(404).json({ message: "Certificate template not found" });
    }

    // Example: serve a pre-made certificate file
    const certificateFile = path.join(__dirname, "../certificates", templatePath);

    res.download(certificateFile, `${enrollment.customerId.name}_Certificate.pdf`);
  } catch (err) {
    console.error("Error downloading certificate:", err.message);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

exports.getAllEncroll = getAllEncroll;
exports.getPlayerById = getPlayerById;
exports.addEnrollment = addEnrollment;
exports.updateCEnrollment = updateCEnrollment;
exports.deleteEnrollment = deleteEnrollment;
exports.filterEnrollments = filterEnrollments;
exports.downloadCertificate = downloadCertificate;



