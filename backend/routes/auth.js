const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/auth');
const authMiddleware = require('../middleware/auth');
const { registerValidation } = require('../utils/validator');

// @route   POST /api/auth/register
router.post('/register', registerValidation, register);

// @route   POST /api/auth/login
router.post('/login', login);

// @route   GET /api/auth/me
router.get('/me', authMiddleware, getMe);

module.exports = router;