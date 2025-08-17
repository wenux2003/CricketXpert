const express = require("express");
const router = express.Router();

// Insert Controller
const Coachcontrol = require("../controllers/Coachcontrol");

// CRUD Routes
router.get("/", Coachcontrol.getAllCoaches);       // Get all coaches
router.get("/:id", Coachcontrol.getCoachById);     // Get one coach by ID
router.post("/", Coachcontrol.addCoach);           // Add a new coach
router.put("/:id", Coachcontrol.updateCoach);      // Update coach by ID
router.delete("/:id", Coachcontrol.deleteCoach);   // Delete coach by ID

module.exports = router;
