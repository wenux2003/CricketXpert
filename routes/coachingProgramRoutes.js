const express = require('express');
const router = express.Router();
const coachingProgramController = require('../controllers/coachingProgramController');

router.post('/', coachingProgramController.createCoachingProgram);
router.get('/', coachingProgramController.getAllCoachingPrograms);
router.get('/:id', coachingProgramController.getCoachingProgramById);
router.put('/:id', coachingProgramController.updateCoachingProgram);
router.delete('/:id', coachingProgramController.deleteCoachingProgram);

module.exports = router;
