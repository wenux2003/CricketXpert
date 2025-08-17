const express = require("express");
const router = express.Router();

// Insert Controller
const CoachingProgramControll = require("../controllers/CoachingProgramControll");

// CRUD Routes
router.get("/",CoachingProgramControll.getAllprogram);       // Get all coaches
router.get("/:id",CoachingProgramControll.getProgramById );     // Get one coach by ID
router.post("/",CoachingProgramControll.addProgram);           // Add a new coach
router.put("/:id",CoachingProgramControll.updateCoachprogram );      // Update coach by ID
router.delete("/:id",CoachingProgramControll.deleteProgram );   // Delete coach by ID
router.get("/filter",CoachingProgramControll.filterPrograms );
module.exports = router;