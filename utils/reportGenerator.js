const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.generateRepairReport = (repair, customer, technician) => {
  const doc = new PDFDocument();
  const fileName = `reports/repair_${repair._id}.pdf`;

  doc.pipe(fs.createWriteStream(fileName));
  doc.fontSize(18).text('Repair Completion Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Customer: ${customer.firstName} ${customer.lastName}`);
  doc.text(`Technician: ${technician.technicianId.firstName} ${technician.technicianId.lastName}`);
  doc.text(`Damage Type: ${repair.damageType}`);
  doc.text(`Cost Estimate: ${repair.costEstimate}`);
  doc.text(`Time Estimate: ${repair.timeEstimate}`);
  doc.text(`Status: ${repair.status}`);
  doc.end();

  return fileName;
};
