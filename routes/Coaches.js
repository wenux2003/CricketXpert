const express = require("express");
const router = express.Router();

// Import Coach controller
const CoachControl = require("../controllers/Coachcontrol");

// Routes
router.get("/", CoachControl.getAllCoaches);         // Get all coaches
router.get("/:id", CoachControl.getCoachById);       // Get coach by ID
router.post("/", CoachControl.createCoach);          // Create new coach
router.put("/:id", CoachControl.updateCoach);        // Update coach
router.delete("/:id", CoachControl.deleteCoach);     // Delete coach  

module.exports = router;
