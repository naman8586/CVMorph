const express = require('express');
const router = express.Router();
const {
  createOrUpdateBase,
  getBase,
  getVersions,
  getVersion,
  deleteVersion,
  getStats
} = require('../controllers/Resume');
const authMiddleware = require('../middleware/auth');
const { resumeValidation } = require('../utils/validator');
const { generatePDF } = require('../utils/pdfGenerator');
const ResumeVersion = require('../models/ResumeVersion');

// All routes require authentication
router.use(authMiddleware);

// Base resume routes
router.post('/base', resumeValidation, createOrUpdateBase);
router.get('/base', getBase);

// Version routes
router.get('/versions', getVersions);
router.get('/versions/:id', getVersion);
router.delete('/versions/:id', deleteVersion);

// Stats
router.get('/stats', getStats);

// PDF download route
router.get('/pdf/:id', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const versionId = req.params.id;

    // Get resume version
    const version = await ResumeVersion.findById(versionId, userId);

    if (!version) {
      return res.status(404).json({
        success: false,
        message: 'Resume version not found'
      });
    }

    // Generate PDF
    const pdf = await generatePDF(version.adapted_content);

    // Set headers
    const filename = `${version.adapted_content.personal_info.name || 'Resume'}_${version.role}.pdf`
      .replace(/\s+/g, '_');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdf);

  } catch (error) {
    next(error);
  }
});

module.exports = router;