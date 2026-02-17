const ResumeBase = require('../models/ResumeBase');
const ResumeVersion = require('../models/ResumeVersion');

// @desc    Create or update base resume
// @route   POST /api/resume/base
// @access  Private
exports.createOrUpdateBase = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const resumeData = req.body;

    // Check if user already has a base resume
    const existing = await ResumeBase.findByUserId(userId);

    let resume;
    if (existing) {
      // Update existing
      resume = await ResumeBase.update(existing.id, userId, resumeData);
    } else {
      // Create new
      resume = await ResumeBase.create(userId, resumeData);
    }

    res.json({
      success: true,
      message: existing ? 'Resume updated successfully' : 'Resume created successfully',
      resume
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get user's base resume
// @route   GET /api/resume/base
// @access  Private
exports.getBase = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const resume = await ResumeBase.findByUserId(userId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'No base resume found. Please create one first.'
      });
    }

    res.json({
      success: true,
      resume
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get all resume versions
// @route   GET /api/resume/versions
// @access  Private
exports.getVersions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const versions = await ResumeVersion.findByUserId(userId);

    res.json({
      success: true,
      count: versions.length,
      versions
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get specific resume version
// @route   GET /api/resume/versions/:id
// @access  Private
exports.getVersion = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const versionId = req.params.id;

    const version = await ResumeVersion.findById(versionId, userId);

    if (!version) {
      return res.status(404).json({
        success: false,
        message: 'Resume version not found'
      });
    }

    res.json({
      success: true,
      version
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete resume version
// @route   DELETE /api/resume/versions/:id
// @access  Private
exports.deleteVersion = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const versionId = req.params.id;

    const deleted = await ResumeVersion.delete(versionId, userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Resume version not found'
      });
    }

    res.json({
      success: true,
      message: 'Resume version deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/resume/stats
// @access  Private
exports.getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const hasBase = await ResumeBase.findByUserId(userId);
    const versionCount = await ResumeVersion.countByUserId(userId);

    res.json({
      success: true,
      stats: {
        hasBaseResume: !!hasBase,
        totalVersions: versionCount
      }
    });

  } catch (error) {
    next(error);
  }
};