const { body } = require('express-validator');

// Validation rules for user registration
exports.registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters')
];

// Validation rules for resume data
exports.resumeValidation = [
  body('personal_info.name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty'),
  body('personal_info.email')
    .optional()
    .isEmail()
    .withMessage('Invalid email in personal info'),
  body('education')
    .optional()
    .isArray()
    .withMessage('Education must be an array'),
  body('experience')
    .optional()
    .isArray()
    .withMessage('Experience must be an array'),
  body('projects')
    .optional()
    .isArray()
    .withMessage('Projects must be an array'),
  body('skills')
    .optional()
    .isObject()
    .withMessage('Skills must be an object')
];