const RepairRequest = require('../models/RepairRequest');
const Technician = require('../models/Technician');
const User = require('../models/User');
const { sendEmail } = require('../utils/notification');
const { generateRepairReport } = require('../utils/reportGenerator');

// 1️⃣ Create a new repair request (Customer)
exports.createRepairRequest = async (req, res) => {
  try {
    const { customerId, damageType } = req.body;
    if (!customerId || !damageType) {
      return res.status(400).json({ error: 'customerId and damageType are required' });
    }

    const repairRequest = await RepairRequest.create({
      customerId,
      damageType,
      status: 'Pending',
    });

    // Notify Service Manager
    const serviceManagerEmail = process.env.SERVICE_MANAGER_EMAIL;
    if (serviceManagerEmail) {
      await sendEmail(
        serviceManagerEmail,
        'New Repair Request Submitted',
        `A new repair request has been submitted.\n\nCustomer ID: ${customerId}\nDamage Type: ${damageType}`
      );
    }

    res.status(201).json(repairRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2️⃣ Update a repair request (Customer general update)
exports.updateRepairGeneral = async (req, res) => {
  try {
    const request = await RepairRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!request) return res.status(404).json({ error: 'Repair request not found' });

    // Notify Service Manager about the update
    const serviceManagerEmail = process.env.SERVICE_MANAGER_EMAIL;
    if (serviceManagerEmail) {
      await sendEmail(
        serviceManagerEmail,
        'Repair Request Updated',
        `Repair request has been updated.\n\nCustomer ID: ${request.customerId}\nDamage Type: ${request.damageType}`
      );
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3️⃣ Get all repair requests (Service Manager)
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

// 4️⃣ Get single repair request by ID
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

// 5️⃣ Update repair request status (Approve/Reject by Service Manager)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, costEstimate, timeEstimate, rejectionReason } = req.body;

    const request = await RepairRequest.findById(id).populate('customerId', 'email');
    if (!request) return res.status(404).json({ error: 'Request not found' });

    request.status = status;

    if (status.toLowerCase() === 'approved') {
      // Only set cost and time if approved
      if (costEstimate !== undefined) request.costEstimate = costEstimate;
      if (timeEstimate !== undefined) request.timeEstimate = timeEstimate;
    } else if (status.toLowerCase() === 'rejected') {
      if (rejectionReason) request.rejectionReason = rejectionReason;
    }

    await request.save();

    // Prepare email message
    let emailBody = `Hello,\n\nYour repair request status is now: ${status}\n`;

    if (status.toLowerCase() === 'approved') {
      emailBody += `\nCost Estimate: ${request.costEstimate !== undefined ? request.costEstimate : 'Not provided'}\n`;
      emailBody += `Time Estimate: ${request.timeEstimate !== undefined ? request.timeEstimate : 'Not provided'}\n`;
    } else if (status.toLowerCase() === 'rejected' && request.rejectionReason) {
      emailBody += `\nReason for Rejection: ${request.rejectionReason}\n`;
    }

    emailBody += `\nThank you,\nService Team`;

    // Notify customer
    await sendEmail(
      request.customerId.email,
      'Repair Request Status Updated',
      emailBody
    );

    res.json({ message: 'Repair request status updated successfully', request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 6 Customer approves/rejects estimate
exports.customerApproveReject = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision } = req.body; // "approve" or "reject"

    const request = await RepairRequest.findById(id).populate('customerId', 'email');
    if (!request) return res.status(404).json({ error: 'Repair request not found' });

    if (decision === 'approve') {
      request.status = 'Customer Approved';
    } else if (decision === 'reject') {
      request.status = 'Customer Rejected';
    } else {
      return res.status(400).json({ error: 'Invalid decision' });
    }

    await request.save();

    // Notify Service Manager
    const serviceManagerEmail = process.env.SERVICE_MANAGER_EMAIL;
    if (serviceManagerEmail) {
      await sendEmail(
        serviceManagerEmail,
        `Customer ${decision === 'approve' ? 'Approved' : 'Rejected'} Estimate`,
        `Customer ID: ${request.customerId._id}\nRepair Request ID: ${request._id}\nDamage Type: ${request.damageType}\nDecision: ${decision === 'approve' ? 'Approved' : 'Rejected'}`
      );
    }

    res.json({ message: `You have ${decision}d the estimate`, request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 7 Assign Technician (only after customer approval)
exports.assignTechnician = async (req, res) => {
  try {
    const { id } = req.params;
    const { technicianId } = req.body;

    const request = await RepairRequest.findById(id).populate('customerId', 'email');
    if (!request) return res.status(404).json({ error: 'Repair request not found' });

    if (request.status !== 'Customer Approved')
      return res.status(400).json({ error: 'Cannot assign technician before customer approves estimate' });

    const technician = await Technician.findById(technicianId).populate('technicianId', 'email');
    if (!technician) return res.status(404).json({ error: 'Technician not found' });

    request.assignedTechnician = technicianId;
    request.status = 'In Repair';
    await request.save();

    // Notify Technician and Customer
    await sendEmail(
      technician.technicianId.email,
      'New Repair Assigned',
      `Repair Request ID: ${request._id}\nDamage Type: ${request.damageType}`
    );

    await sendEmail(
      request.customerId.email,
      'Technician Assigned',
      `Repair Request ID: ${request._id}\nTechnician has been assigned.`
    );

    res.json({ message: 'Technician assigned successfully', request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 8 Update repair progress (Technician)
exports.updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { repairProgress, currentStage } = req.body;

    const request = await RepairRequest.findById(id).populate('customerId', 'email');
    if (!request) return res.status(404).json({ error: 'Repair request not found' });

    if (repairProgress !== undefined) request.repairProgress = repairProgress;
    if (currentStage) request.currentStage = currentStage;

    await request.save();

    // Notify customer
    await sendEmail(
      request.customerId.email,
      'Repair Progress Updated',
      `Repair progress: ${repairProgress || 0}%\nCurrent Stage: ${currentStage || 'N/A'}`
    );

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 9 Generate repair report (PDF)
exports.generateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await RepairRequest.findById(id)
      .populate('customerId', 'username email')
      .populate({ path: 'assignedTechnician', populate: { path: 'technicianId', select: 'username email' } });

    if (!request) return res.status(404).json({ error: 'Request not found' });

    const pdfBuffer = await generateRepairReport(request);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=repair_report_${id}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 10 Delete repair request
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
