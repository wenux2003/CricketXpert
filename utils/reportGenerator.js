// utils/reportGenerator.js
const PDFDocument = require('pdfkit');

exports.pipeRepairReportToResponse = (res, data) => {
  const doc = new PDFDocument();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=repair_report_${data._id}.pdf`);

  doc.pipe(res);

  doc.fontSize(18).text('Repair Completion Report', { align: 'center' }).moveDown();
  doc.fontSize(12).text(`Repair ID: ${data._id}`);
  doc.text(`Customer: ${data.customerId?.username || ''} (${data.customerId?.email || ''})`);
  if (data.assignedTechnician?.technicianId) {
    doc.text(`Technician: ${data.assignedTechnician.technicianId.username || ''} (${data.assignedTechnician.technicianId.email || ''})`);
  } else {
    doc.text(`Technician: -`);
  }
  doc.text(`Damage Type: ${data.damageType}`);
  doc.text(`Cost Estimate: ${data.costEstimate ?? '-'}`);
  doc.text(`Time Estimate: ${data.timeEstimate ?? '-'}`);
  doc.text(`Status: ${data.status}`);
  doc.text(`Progress: ${data.repairProgress || 0}%`);
  if (data.currentStage) doc.text(`Current Stage: ${data.currentStage}`);

  doc.end();
};
 