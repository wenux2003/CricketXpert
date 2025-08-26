const RepairRequest = require('../models/RepairRequest');
const Technician = require('../models/Technician');
const User = require('../models/User');
const { sendEmail } = require('../utils/notification');
const { pipeRepairReportToResponse, sendRepairReportEmail } = require('../utils/reportGenerator');


/**
 * 1️ Create a new Repair Request (Customer)
 * - Customer submits a repair request with damage details.
 * - Status is set to 'Pending'.
 * - Service Manager is notified via email.
 */
exports.createRepairRequest = async (req, res) => {
  try {
    const { customerId, equipmentType, damageType, description } = req.body;

    if (!customerId || !equipmentType || !damageType || !description)
      return res.status(400).json({ error: 'customerId, equipmentType, damageType, and description are required' });

    const repairRequest = await RepairRequest.create({
      customerId,
      equipmentType,
      damageType,
      description,
      status: 'Pending',
      repairProgress: 0,
      currentStage: 'Request Submitted'
    });
    //Notify Service Manager
    if (process.env.SERVICE_MANAGER_EMAIL) {
      await sendEmail(
        process.env.SERVICE_MANAGER_EMAIL,
        'New Repair Request Submitted',
        `A new repair request has been submitted.\n\nCustomer ID: ${customerId}\nEquipment: ${equipmentType}\nDamage Type: ${damageType}`
      );
    }

    res.status(201).json({ message: 'Repair request created', repairRequest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 2️ Update Repair Request (General)
 * - Allows updating general fields of a repair request.
 * - Service Manager is notified of any changes.
 */
exports.updateRepairGeneral = async (req, res) => {
  try {
    const request = await RepairRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!request) return res.status(404).json({ error: 'Repair request not found' });

    if (process.env.SERVICE_MANAGER_EMAIL) {
      await sendEmail(
        process.env.SERVICE_MANAGER_EMAIL,
        'Repair Request Updated',
        `Repair request has been updated.\n\nCustomer ID: ${request.customerId}\nDamage Type: ${request.damageType}`
      );
    }

    res.json({ message: 'Repair request updated', request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 3️ Get All Repair Requests (Service Manager)
 * - Returns all repair requests.
 * - Populates customer and assigned technician details.
 */
exports.getAllRepairRequests = async (req, res) => {
  try {
    const requests = await RepairRequest.find()
      .populate('customerId', 'username email')
      .populate({ path: 'assignedTechnician', populate: { path: 'technicianId', select: 'username email' } });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 4️ Get Repair Request By ID
 * - Returns a single repair request by ID.
 * - Populates customer and assigned technician details.
 */
exports.getRepairRequestById = async (req, res) => {
  try {
    const request = await RepairRequest.findById(req.params.id)
      .populate('customerId', 'username email')
      .populate({ path: 'assignedTechnician', populate: { path: 'technicianId', select: 'username email' } });
    if (!request) return res.status(404).json({ error: 'Repair request not found' });
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 5️ Update Request Status (Service Manager Approve / Reject)
 * - Service Manager can approve or reject repair requests.
 * - If approved: cost and time estimates can be added.
 * - Status and current stage are updated accordingly.
 * - Customer receives email notification.
 */
exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, costEstimate, timeEstimate, rejectionReason } = req.body;

    const request = await RepairRequest.findById(id).populate('customerId', 'email username');
    if (!request) return res.status(404).json({ error: 'Repair request not found' });

    request.status = status;

    if (status.toLowerCase() === 'approved') {
   // Only set cost and time if approved
      if (costEstimate !== undefined) request.costEstimate = costEstimate;
      if (timeEstimate !== undefined) request.timeEstimate = timeEstimate;
      request.currentStage = 'Waiting for Customer Approval';
    } else if (status.toLowerCase() === 'rejected') {
      if (rejectionReason) request.rejectionReason = rejectionReason;
      request.currentStage = 'Request Rejected';
    }

    await request.save();

    // Send email to customer
    let emailBody = `Hello ${request.customerId.username},\n\nYour repair request status is: ${status}\n`;
    if (status.toLowerCase() === 'approved') {
      emailBody += `Cost Estimate: ${request.costEstimate || 'Not provided'}\nTime Estimate: ${request.timeEstimate || 'Not provided'}\n`;
    } else if (status.toLowerCase() === 'rejected') {
      emailBody += `Reason: ${request.rejectionReason || 'Not provided'}\n`;
    }
    emailBody += '\nThank you,\nService Team';
    await sendEmail(request.customerId.email, 'Repair Request Status Updated', emailBody);

    res.json({ message: 'Repair request status updated sucessfully', request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 6️ Customer Approve / Reject Estimate
 * - Customer can approve or reject the service estimate.
 * - Updates request status and current stage.
 * - Service Manager is notified.
 */
exports.customerApproveReject = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision } = req.body;

    const request = await RepairRequest.findById(id).populate('customerId', 'email username');
    if (!request) return res.status(404).json({ error: 'Repair request not found' });

    if (decision === 'approve') {
      request.status = 'Customer Approved';
      request.currentStage = 'Approved by Customer';
    } else if (decision === 'reject') {
      request.status = 'Customer Rejected';
      request.currentStage = 'Rejected by Customer';
    } else return res.status(400).json({ error: 'Invalid decision' });

    await request.save();

    if (process.env.SERVICE_MANAGER_EMAIL) {
      await sendEmail(
        process.env.SERVICE_MANAGER_EMAIL,
        `Customer ${decision}d Estimate`,
        `Repair Request ID: ${request._id}\nDecision: ${decision}`
      );
    }

    res.json({ message: `Customer has ${decision}d the estimate`, request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 7️ Assign Technician
 * - Only after customer approves.
 * - Validates technician availability and skills.
 * - Technician is notified and status is updated to 'In Repair'.
 */
exports.assignTechnician = async (req, res) => {
  try {
    const { id } = req.params;
    const { technicianId, assignmentNotes } = req.body;

    // Validate request exists and is in correct status
    const request = await RepairRequest.findById(id).populate('customerId', 'email username');
    if (!request) {
      return res.status(404).json({ error: 'Repair request not found' });
    }
    
    if (request.status !== 'Customer Approved') {
      return res.status(400).json({ 
        error: 'Cannot assign technician. Request must be approved by customer first.' 
      });
    }

    // Validate technician exists
    const technician = await Technician.findById(technicianId).populate('technicianId', 'email username');
    if (!technician) {
      return res.status(404).json({ error: 'Technician not found' });
    }

    // Validate technician availability
    if (!technician.available) {
      return res.status(400).json({ 
        error: 'Technician is currently unavailable for new assignments' 
      });
    }

    // Count active repairs for this technician
    const activeRepairs = await RepairRequest.countDocuments({
      assignedTechnician: technicianId,
      status: { $in: ['In Repair', 'Halfway Completed'] }
    });

    if (activeRepairs >= 10) {
      return res.status(400).json({ 
        error: 'Technician has reached maximum capacity (10 active repairs). Please assign to another technician.' 
      });
    }

    // Validate technician skills match equipment type (optional enhancement)
    const equipmentType = request.equipmentType;
    const technicianSkills = technician.skills || [];
    
    // Check if technician has skills for this equipment type
    const hasRelevantSkill = technicianSkills.some(skill => 
      skill.toLowerCase().includes(equipmentType.replace('_', ' ').toLowerCase()) ||
      skill.toLowerCase().includes('general') ||
      skill.toLowerCase().includes('all')
    );

    if (!hasRelevantSkill && technicianSkills.length > 0) {
      return res.status(400).json({ 
        error: `Technician does not have skills for ${equipmentType.replace('_', ' ')} repairs. Please assign to a qualified technician.` 
      });
    }

    // Assign technician to request
    request.assignedTechnician = technicianId;
    request.status = 'In Repair';
    request.currentStage = 'Technician Assigned';
    if (assignmentNotes) {
      request.notes = assignmentNotes;
    }
    await request.save();

    // Update technician availability if they reach capacity
    if (activeRepairs + 1 >= 10) {
      technician.available = false;
      await technician.save();
    }

    // Send notification emails
    try {
      await sendEmail(
        technician.technicianId.email, 
        'New Repair Assignment', 
        `You have been assigned a new repair request:\n\nRequest ID: ${request._id}\nEquipment: ${equipmentType.replace('_', ' ')}\nDamage Type: ${request.damageType}\nCustomer: ${request.customerId.username}\n\nPlease begin work on this repair.`
      );
      
      await sendEmail(
        request.customerId.email, 
        'Technician Assigned', 
        `Your repair request has been assigned to a technician:\n\nRequest ID: ${request._id}\nEquipment: ${equipmentType.replace('_', ' ')}\nDamage Type: ${request.damageType}\nStatus: In Repair\n\nYour repair is now in progress.`
      );
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't fail the assignment if email fails
    }

    res.json({ 
      message: 'Technician assigned successfully', 
      request: {
        _id: request._id,
        status: request.status,
        currentStage: request.currentStage,
        assignedTechnician: technician.technicianId.username,
        equipmentType: request.equipmentType,
        damageType: request.damageType
      }
    });
  } catch (err) {
    console.error('Technician assignment error:', err);
    res.status(500).json({ error: err.message });
  }
};

  // Update repairProgress
exports.updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { repairProgress } = req.body;

    const request = await RepairRequest.findById(id)
      .populate('customerId', 'email username');
    if (!request) return res.status(404).json({ error: 'Repair request not found' });

    if (repairProgress === undefined || repairProgress < 0 || repairProgress > 100) {
      return res.status(400).json({ error: 'repairProgress must be between 0 and 100' });
    }

 
    request.repairProgress = repairProgress;

    // Auto-update status & currentStage based on milestones
    if (repairProgress === 0) {
      request.status = 'In Repair';
      request.currentStage = 'Repair Started';
    } else if (repairProgress > 0 && repairProgress < 50) {
      request.status = 'In Repair';
      request.currentStage = 'Repair In Progress';
    } else if (repairProgress >= 50 && repairProgress < 100) {
      request.status = 'Halfway Completed';
      request.currentStage = 'Repair Halfway Completed';
    } else if (repairProgress === 100) {
      request.status = 'Ready for Pickup';
      request.currentStage = 'Repair Complete';
    
      // Mark technician available if <10 active repairs remain
      if (request.assignedTechnician) {
        const technician = await Technician.findById(request.assignedTechnician);
        if (technician) {
          const activeRepairs = await RepairRequest.countDocuments({
            assignedTechnician: technician._id,
            status: { $in: ['In Repair', 'Halfway Completed'] }
          });
          if (activeRepairs < 10) {
            technician.available = true;
            await technician.save();
          }
        }
      }
    }
    // Save updated repair request
    await request.save();

    // Send email notification to customer
    await sendEmail(
      request.customerId.email,
      'Repair Progress Updated',
      `Hello ${request.customerId.username},\n\nYour repair request progress has been updated:\nProgress: ${request.repairProgress}%\nStatus: ${request.status}\nCurrent Stage: ${request.currentStage}\n\nThank you.`
    );

    res.json({ message: 'Progress and current stage updated successfully', request });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/**
 * 8 Customer Dashboard
 */
exports.getCustomerRepairRequests = async (req, res) => {
  try {
    const { customerId } = req.params;
    const requests = await RepairRequest.find({ customerId })
      .populate('assignedTechnician')
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 9 Technician Dashboard
 */
exports.getTechnicianRepairRequests = async (req, res) => {
  try {
    const { technicianId } = req.params;
    const { status } = req.query;

    let filter = { assignedTechnician: technicianId };
    if (status) filter.status = status;

    const requests = await RepairRequest.find(filter)
      .populate('customerId', 'username email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 10️ Service Manager Dashboard (with filtering & sorting)
exports.getAllRepairRequests = async (req, res) => {
  try {
    const { status, customerId, technicianId, sortBy, sortOrder } = req.query;

    // Build filter object
    let filter = {};
    if (status) filter.status = status;
    if (customerId) filter.customerId = customerId;
    if (technicianId) filter.assignedTechnician = technicianId;

    // Build sort order
    let sort = { createdAt: -1 };
    const order = String(sortOrder || 'desc').toLowerCase() === 'asc' ? 1 : -1;
    if ((sortBy || '').toLowerCase() === 'status') {
      sort = { status: order, createdAt: -1 };
    } else if ((sortBy || '').toLowerCase() === 'date') {
      sort = { createdAt: order };
    }

    const requests = await RepairRequest.find(filter)
      .populate('customerId', 'username email')
      .populate({ path: 'assignedTechnician', populate: { path: 'technicianId', select: 'username email skills' } })
      .sort(sort);

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





/**
 * 11 Download & Email PDF (for frontend download button)
 */
exports.downloadAndEmailReport = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await RepairRequest.findById(id)
      .populate('customerId', 'username email')
      .populate({ path: 'assignedTechnician', populate: { path: 'technicianId', select: 'username email' } });

    if (!request) return res.status(404).json({ error: 'Repair request not found' });

    await sendRepairReportEmail(request); // send email
    pipeRepairReportToResponse(res, request); // download in browser

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/**
 * 12 Delete Repair Request
 * - Removes a repair request from the database.
 */
exports.deleteRepairRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await RepairRequest.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Repair request not found' });
    res.json({ message: 'Repair request deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 