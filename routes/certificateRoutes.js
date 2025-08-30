const express = require('express');
const router = express.Router();
const {
  generateCertificate,
  getCertificateById,
  getUserCertificates,
  downloadCertificate,
  verifyCertificate,
  revokeCertificate,
  getCertificateStats
} = require('../controllers/certificateController');

// @route   POST /api/certificates/generate/:enrollmentId
// @desc    Generate certificate for enrollment
// @access  Private (User or Admin)
router.post('/generate/:enrollmentId', generateCertificate);

// @route   GET /api/certificates/:id
// @desc    Get certificate by ID
// @access  Private (User or Admin)
router.get('/:id', getCertificateById);

// @route   GET /api/certificates/user/:userId
// @desc    Get user certificates
// @access  Private (User themselves or Admin)
router.get('/user/:userId', getUserCertificates);

// @route   GET /api/certificates/:certificateId/download
// @desc    Download certificate PDF
// @access  Private (User or Admin)
router.get('/:certificateId/download', downloadCertificate);

// @route   GET /api/certificates/verify/:certificateNumber
// @desc    Verify certificate publicly
// @access  Public
router.get('/verify/:certificateNumber', verifyCertificate);

// @route   PUT /api/certificates/:certificateId/revoke
// @desc    Revoke certificate
// @access  Private (Admin only)
router.put('/:certificateId/revoke', revokeCertificate);

// @route   GET /api/certificates/stats
// @desc    Get certificate statistics
// @access  Private (Admin or Coach Manager)
router.get('/stats', getCertificateStats);

module.exports = router;
