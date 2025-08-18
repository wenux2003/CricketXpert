const express = require("express");
const router = express.Router();
const { filterEnrollments, downloadCertificate } = require("../controllers/EnrollmentController");
// Insert Controller
const CoachingProgramControll = require("../controllers/CoachingProgramControll");

// CRUD Routes
router.get("/",CoachingProgramControll.getAllprogram);       // Get all coaches
router.get("/:id", CoachingProgramControll.getProgramById);     // Get one coach by ID
router.post("/", CoachingProgramControll.addProgram);           // Add a new coach
router.put("/:id",CoachingProgramControll.updateCoachprogram);      // Update coach by ID
router.delete("/:id",CoachingProgramControll.deleteProgram);   // Delete coach by ID

// Filter enrollments
// Example: GET /api/enrollments/filter?customerId=123&status=completed
router.get("/filter", filterEnrollments);

// Download certificate (only if completed)
// Example: GET /api/enrollments/certificate/66b8e91e9d8b2a4b72f1d222
router.get("/certificate/:enrollmentId", downloadCertificate);

module.exports = router;