const express = require('express');
const router = express.Router();
const repairController = require('../controllers/repairRequestController');

// Create a new repair request (Customer)
router.post('/', repairController.createRepairRequest);

// Update a repair request (Customer)
router.put('/:id', repairController.updateRepairGeneral);

// Get all repair requests (Service Manager)
router.get('/', repairController.getAllRepairRequests);

// Get a single repair request by ID
router.get('/:id', repairController.getRepairRequestById);

// Update repair status (Approve/Reject by Service Manager)
router.put('/status/:id', repairController.updateRequestStatus);

// Customer approves/rejects estimate
router.put('/customer-decision/:id', repairController.customerApproveReject);

// Assign technician to repair (Service Manager)
router.put('/assign/:id', repairController.assignTechnician);

// Update repair progress (Technician)
router.put('/progress/:id', repairController.updateProgress);

// Download repair report (PDF)
router.get('/report/:id', repairController.generateReport);

// Delete repair request
router.delete('/:id', repairController.deleteRepairRequest);

module.exports = router;
