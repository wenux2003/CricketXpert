const express = require("express");
const router = express.Router();
const coachController = require("../controllers/coachController");

// Basic CRUD
router.post("/", coachController.createCoach);
router.get("/", coachController.getAllCoaches);
router.get("/:id", coachController.getCoachById);
router.put("/:id", coachController.updateCoach);
router.delete("/:id", coachController.deleteCoach);

// Extra routes
router.post("/:id/certificates", coachController.addCertificate);
router.put("/:id/availability", coachController.updateAvailability);
router.put("/:id/status", coachController.updateStatus);
// Search & Filter
router.get("/search", coachController.searchCoaches);


module.exports = router;
