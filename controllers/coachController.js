const MCoach = require("../models/MCoach"); // adjust path if needed

// ================= CRUD Operations =================

// @desc Create a new coach profile
exports.createCoach = async (req, res) => {
  try {
    const coach = new MCoach(req.body);
    await coach.save();
    res.status(201).json({ success: true, data: coach });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc Get all coaches
exports.getAllCoaches = async (req, res) => {
  try {
    const coaches = await MCoach.find().populate("UserId", "name email role");
    res.status(200).json({ success: true, data: coaches });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc Get a coach by ID
exports.getCoachById = async (req, res) => {
  try {
    const coach = await MCoach.findById(req.params.id).populate("UserId", "name email role");
    if (!coach) {
      return res.status(404).json({ success: false, message: "Coach not found" });
    }
    res.status(200).json({ success: true, data: coach });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc Update coach profile
exports.updateCoach = async (req, res) => {
  try {
    const coach = await MCoach.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!coach) {
      return res.status(404).json({ success: false, message: "Coach not found" });
    }
    res.status(200).json({ success: true, data: coach });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc Delete a coach profile
exports.deleteCoach = async (req, res) => {
  try {
    const coach = await MCoach.findByIdAndDelete(req.params.id);
    if (!coach) {
      return res.status(404).json({ success: false, message: "Coach not found" });
    }
    res.status(200).json({ success: true, message: "Coach deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ================= Extra Functions =================

// @desc Add certificate to coach
exports.addCertificate = async (req, res) => {
  try {
    const { name, issuedBy, issuedDate, expiryDate, certificateUrl } = req.body;
    const coach = await MCoach.findById(req.params.id);
    if (!coach) return res.status(404).json({ success: false, message: "Coach not found" });

    coach.certifications.push({ name, issuedBy, issuedDate, expiryDate, certificateUrl });
    await coach.save();

    res.status(200).json({ success: true, data: coach });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc Update coach availability
exports.updateAvailability = async (req, res) => {
  try {
    const coach = await MCoach.findById(req.params.id);
    if (!coach) return res.status(404).json({ success: false, message: "Coach not found" });

    coach.availability = req.body.availability; // replace entire availability
    await coach.save();

    res.status(200).json({ success: true, data: coach });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc Update coach status (active/inactive/suspended)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const coach = await MCoach.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!coach) return res.status(404).json({ success: false, message: "Coach not found" });

    res.status(200).json({ success: true, data: coach });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc Search & filter coaches
exports.searchCoaches = async (req, res) => {
  try {
    const { specialization, minExp, maxExp, minRating, day, status } = req.query;

    let filter = {};

    // ✅ Filter by specialization
    if (specialization) {
      filter.specialization = { $in: specialization.split(",") };
    }

    // ✅ Filter by experience
    if (minExp || maxExp) {
      filter.experienceYears = {};
      if (minExp) filter.experienceYears.$gte = parseInt(minExp);
      if (maxExp) filter.experienceYears.$lte = parseInt(maxExp);
    }

    // ✅ Filter by rating
    if (minRating) {
      filter["rating.averageRating"] = { $gte: parseFloat(minRating) };
    }

    // ✅ Filter by status
    if (status) {
      filter.status = status;
    }

    // ✅ Filter by availability day
    if (day) {
      filter["availability.day"] = day;
      filter["availability.isActive"] = true;
    }

    // Run query
    const coaches = await MCoach.find(filter).populate("UserId", "name email");

    res.status(200).json({ success: true, count: coaches.length, data: coaches });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
