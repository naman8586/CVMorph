const express = require('express');
const router = express.Router();
const { adaptResume, getRoles } = require('../controllers/ai');
const authMiddleware = require('../middleware/auth');

// Public route - get available roles
router.get('/roles', getRoles);

// Protected routes
router.post('/adapt', authMiddleware, adaptResume);

module.exports = router;