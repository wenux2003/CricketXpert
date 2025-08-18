const express = require('express');
const router = express.Router();
const technicianController = require('../controllers/technicianController');

// Create a new technician
router.post('/', technicianController.createTechnician);

// Get all technicians
router.get('/', technicianController.getAllTechnicians);

// Get technician by ID
router.get('/:id', technicianController.getTechnicianById);

// Update technician info
router.put('/:id', technicianController.updateTechnician);

// Delete technician
router.delete('/:id', technicianController.deleteTechnician);

module.exports = router;
