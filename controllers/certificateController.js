const Certificate = require('../models/Certificate');
const Enrollment = require('../models/Enrollment');
const Notification = require('../models/Notification');
const path = require('path');
const fs = require('fs');

// Try to import PDFDocument, but make it optional
let PDFDocument;
try {
  PDFDocument = require('pdfkit');
} catch (error) {
  console.warn('PDFKit not installed. PDF generation will be disabled.');
  PDFDocument = null;
}

// Generate certificate for enrollment
const generateCertificate = async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    const enrollment = await Enrollment.findById(enrollmentId)
      .populate('user', 'firstName lastName email')
      .populate({
        path: 'program',
        populate: {
          path: 'coach',
          populate: {
            path: 'userId',
            select: 'firstName lastName'
          }
        }
      });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    if (!enrollment.certificateEligible || enrollment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Not eligible for certificate'
      });
    }

    if (enrollment.certificateIssued) {
      return res.status(400).json({
        success: false,
        message: 'Certificate already issued for this enrollment'
      });
    }

    // Create certificate record
    const certificate = new Certificate({
      user: enrollment.user._id,
      enrollment: enrollment._id,
      program: enrollment.program._id,
      coach: enrollment.program.coach._id,
      title: enrollment.program.title,
      description: `Certificate of completion for ${enrollment.program.title}`,
      completionDetails: {
        startDate: enrollment.enrollmentDate,
        endDate: new Date(),
        totalSessions: enrollment.progress.totalSessions,
        attendedSessions: enrollment.progress.completedSessions,
        attendancePercentage: Math.round((enrollment.progress.completedSessions / enrollment.progress.totalSessions) * 100),
        skillAssessments: enrollment.progress.skillAssessments,
        finalGrade: calculateGrade(enrollment.progress.progressPercentage)
      },
      metadata: {
        generatedBy: req.user?.id // Assuming middleware sets req.user
      }
    });

    await certificate.save();

    // Update enrollment
    enrollment.certificateIssued = true;
    enrollment.certificateId = certificate._id;
    await enrollment.save();

    // Generate PDF certificate if PDFKit is available
    if (PDFDocument) {
      try {
        const pdfPath = await generateCertificatePDF(certificate, enrollment);
        certificate.fileUrl = pdfPath;
        await certificate.save();
      } catch (error) {
        console.warn('PDF generation failed:', error.message);
        // Continue without PDF - certificate record is still created
      }
    } else {
      console.warn('PDF generation skipped - PDFKit not available');
    }

    // Send notification
    await Notification.createNotification({
      recipient: enrollment.user._id,
      title: 'Certificate Ready!',
      message: `Your certificate for "${enrollment.program.title}" is ready for download.`,
      type: 'certificate_ready',
      category: 'success',
      relatedModel: 'Certificate',
      relatedId: certificate._id,
      actionUrl: `/certificates/${certificate._id}`,
      actionText: 'Download Certificate',
      deliveryChannels: [{ channel: 'in_app' }, { channel: 'email' }]
    });

    res.status(201).json({
      success: true,
      message: 'Certificate generated successfully',
      data: certificate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating certificate',
      error: error.message
    });
  }
};

// Get certificate by ID
const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('program', 'title description category')
      .populate({
        path: 'coach',
        populate: {
          path: 'userId',
          select: 'firstName lastName'
        }
      })
      .populate('enrollment', 'enrollmentDate status');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    res.json({
      success: true,
      data: certificate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching certificate',
      error: error.message
    });
  }
};

// Get user certificates
const getUserCertificates = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const filter = { user: userId };
    if (status) {
      filter.status = status;
    }

    const certificates = await Certificate.find(filter)
      .populate('program', 'title category')
      .populate({
        path: 'coach',
        populate: {
          path: 'userId',
          select: 'firstName lastName'
        }
      })
      .sort({ issueDate: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalCertificates = await Certificate.countDocuments(filter);

    res.json({
      success: true,
      data: certificates,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCertificates / parseInt(limit)),
        totalCertificates
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user certificates',
      error: error.message
    });
  }
};

// Download certificate PDF
const downloadCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findById(certificateId)
      .populate('user', 'firstName lastName')
      .populate('program', 'title')
      .populate({
        path: 'coach',
        populate: {
          path: 'userId',
          select: 'firstName lastName'
        }
      });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    if (!certificate.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Certificate is not valid or has been revoked'
      });
    }

    // Check if PDF file exists
    if (!certificate.fileUrl || !fs.existsSync(certificate.fileUrl)) {
      // Regenerate PDF if it doesn't exist
      const enrollment = await Enrollment.findById(certificate.enrollment);
      const pdfPath = await generateCertificatePDF(certificate, enrollment);
      certificate.fileUrl = pdfPath;
      await certificate.save();
    }

    // Increment download count
    await certificate.incrementDownload();

    // Set headers for file download
    const fileName = `certificate-${certificate.certificateNumber}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    // Stream the file
    const fileStream = fs.createReadStream(certificate.fileUrl);
    fileStream.pipe(res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error downloading certificate',
      error: error.message
    });
  }
};

// Verify certificate publicly
const verifyCertificate = async (req, res) => {
  try {
    const { certificateNumber } = req.params;

    const verification = await Certificate.verifyCertificate(certificateNumber);

    res.json({
      success: verification.valid,
      message: verification.message || 'Certificate verification completed',
      data: verification.certificate || null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying certificate',
      error: error.message
    });
  }
};

// Revoke certificate
const revokeCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const { reason } = req.body;

    const certificate = await Certificate.findById(certificateId)
      .populate('user', 'firstName lastName');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    if (certificate.status === 'revoked') {
      return res.status(400).json({
        success: false,
        message: 'Certificate is already revoked'
      });
    }

    // Update certificate status
    certificate.status = 'revoked';
    certificate.notes = reason || 'Certificate revoked by administrator';
    certificate.metadata.lastModified = new Date();
    await certificate.save();

    // Send notification to certificate holder
    await Notification.createNotification({
      recipient: certificate.user._id,
      title: 'Certificate Revoked',
      message: `Your certificate "${certificate.title}" has been revoked.`,
      type: 'general',
      category: 'warning',
      relatedModel: 'Certificate',
      relatedId: certificate._id,
      deliveryChannels: [{ channel: 'in_app' }, { channel: 'email' }]
    });

    res.json({
      success: true,
      message: 'Certificate revoked successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error revoking certificate',
      error: error.message
    });
  }
};

// Get certificate statistics
const getCertificateStats = async (req, res) => {
  try {
    const { startDate, endDate, coach, program } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.issueDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Build aggregation pipeline
    let pipeline = [
      { $match: dateFilter }
    ];

    if (program) {
      pipeline.push({ $match: { program: mongoose.Types.ObjectId(program) } });
    }

    if (coach) {
      pipeline.push({ $match: { coach: mongoose.Types.ObjectId(coach) } });
    }

    pipeline.push(
      {
        $group: {
          _id: null,
          totalCertificates: { $sum: 1 },
          activeCertificates: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          revokedCertificates: {
            $sum: { $cond: [{ $eq: ['$status', 'revoked'] }, 1, 0] }
          },
          totalDownloads: { $sum: '$downloadCount' }
        }
      }
    );

    const stats = await Certificate.aggregate(pipeline);
    const result = stats[0] || {
      totalCertificates: 0,
      activeCertificates: 0,
      revokedCertificates: 0,
      totalDownloads: 0
    };

    // Get monthly issuance trend
    const monthlyTrend = await Certificate.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            year: { $year: '$issueDate' },
            month: { $month: '$issueDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get grade distribution
    const gradeDistribution = await Certificate.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$completionDetails.finalGrade',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        summary: result,
        monthlyTrend,
        gradeDistribution
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching certificate statistics',
      error: error.message
    });
  }
};

// Helper function to calculate grade based on progress percentage
const calculateGrade = (percentage) => {
  if (percentage >= 95) return 'A+';
  if (percentage >= 90) return 'A';
  if (percentage >= 85) return 'A-';
  if (percentage >= 80) return 'B+';
  if (percentage >= 75) return 'B';
  if (percentage >= 70) return 'B-';
  if (percentage >= 65) return 'C+';
  if (percentage >= 60) return 'C';
  return 'Pass';
};

// Helper function to generate PDF certificate
const generateCertificatePDF = async (certificate, enrollment) => {
  if (!PDFDocument) {
    throw new Error('PDFKit not available');
  }

  return new Promise((resolve, reject) => {
    try {
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(__dirname, '../uploads/certificates');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const fileName = `certificate-${certificate.certificateNumber}.pdf`;
      const filePath = path.join(uploadsDir, fileName);

      // Create PDF document
      const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4'
      });

      // Pipe the PDF to a file
      doc.pipe(fs.createWriteStream(filePath));

      // Add content to PDF
      doc.fontSize(30)
         .font('Helvetica-Bold')
         .text('CERTIFICATE OF COMPLETION', 50, 100, { align: 'center' });

      doc.fontSize(16)
         .font('Helvetica')
         .text('This is to certify that', 50, 180, { align: 'center' });

      doc.fontSize(24)
         .font('Helvetica-Bold')
         .text(`${enrollment.user.firstName} ${enrollment.user.lastName}`, 50, 220, { align: 'center' });

      doc.fontSize(16)
         .font('Helvetica')
         .text('has successfully completed the coaching program', 50, 280, { align: 'center' });

      doc.fontSize(20)
         .font('Helvetica-Bold')
         .text(`"${enrollment.program.title}"`, 50, 320, { align: 'center' });

      doc.fontSize(14)
         .font('Helvetica')
         .text(`Completion Date: ${new Date().toLocaleDateString()}`, 50, 380, { align: 'center' })
         .text(`Certificate Number: ${certificate.certificateNumber}`, 50, 400, { align: 'center' })
         .text(`Attendance: ${certificate.completionDetails.attendancePercentage}%`, 50, 420, { align: 'center' })
         .text(`Grade: ${certificate.completionDetails.finalGrade}`, 50, 440, { align: 'center' });

      // Add coach signature area
      doc.fontSize(12)
         .text(`Coach: ${enrollment.program.coach.userId.firstName} ${enrollment.program.coach.userId.lastName}`, 50, 500)
         .text('CricketXpert Academy', 450, 500);

      // Add verification info
      doc.fontSize(10)
         .text(`Verify at: ${process.env.BASE_URL || 'http://localhost:3000'}/api/certificates/verify/${certificate.certificateNumber}`, 50, 550, { align: 'center' });

      // Finalize the PDF
      doc.end();

      // Resolve with the file path when PDF is complete
      doc.on('end', () => {
        resolve(filePath);
      });

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateCertificate,
  getCertificateById,
  getUserCertificates,
  downloadCertificate,
  verifyCertificate,
  revokeCertificate,
  getCertificateStats
};
