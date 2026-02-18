const express = require('express');
const router = express.Router();

const protect = require('../middleware/auth');
const upload = require('../config/multer');

const {
  getRoles,
  adaptResume,
  parseUploadedResume,
  getAIStatus
} = require('../controllers/ai');

// -----------------------
// Public routes
// -----------------------
router.get('/roles', getRoles);
router.get('/status', getAIStatus);

// -----------------------
// Protected routes
// -----------------------
router.post('/adapt', protect, adaptResume);

router.post(
  '/parse-resume',
  protect,
  upload.single('resume'), // 🔥 THIS NOW WORKS
  parseUploadedResume
);

module.exports = router;
