const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Auth validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  handleValidationErrors
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Portfolio validation rules
const createPortfolioValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description must not exceed 5000 characters'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Category must not exceed 100 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Each tag must not exceed 50 characters'),
  handleValidationErrors
];

const updatePortfolioValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid portfolio ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description must not exceed 5000 characters'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Category must not exceed 100 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Each tag must not exceed 50 characters'),
  handleValidationErrors
];

// Project validation rules
const createProjectValidation = [
  param('portfolioId')
    .isUUID()
    .withMessage('Invalid portfolio ID'),
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 10000 })
    .withMessage('Description must not exceed 10000 characters'),
  body('shortDescription')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Short description must not exceed 500 characters'),
  body('technologies')
    .optional()
    .isArray()
    .withMessage('Technologies must be an array'),
  body('technologies.*')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Each technology must not exceed 100 characters'),
  body('projectUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Project URL must be a valid URL'),
  body('githubUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('GitHub URL must be a valid URL'),
  handleValidationErrors
];

const updateProjectValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid project ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 10000 })
    .withMessage('Description must not exceed 10000 characters'),
  body('shortDescription')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Short description must not exceed 500 characters'),
  body('technologies')
    .optional()
    .isArray()
    .withMessage('Technologies must be an array'),
  body('technologies.*')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Each technology must not exceed 100 characters'),
  body('projectUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Project URL must be a valid URL'),
  body('githubUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('GitHub URL must be a valid URL'),
  handleValidationErrors
];

// User validation rules
const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Bio must not exceed 2000 characters'),
  body('headline')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Headline must not exceed 200 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location must not exceed 100 characters'),
  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Website must be a valid URL'),
  body('linkedinUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('LinkedIn URL must be a valid URL'),
  body('githubUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('GitHub URL must be a valid URL'),
  body('twitterUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Twitter URL must be a valid URL'),
  handleValidationErrors
];

// Search validation rules
const searchValidation = [
  query('q')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Search query must not exceed 200 characters'),
  query('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Category must not exceed 100 characters'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

// ID parameter validation
const idParamValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid ID format'),
  handleValidationErrors
];

// Slug parameter validation
const slugParamValidation = [
  param('slug')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Invalid slug format')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug must contain only lowercase letters, numbers, and hyphens'),
  handleValidationErrors
];

module.exports = {
  registerValidation,
  loginValidation,
  createPortfolioValidation,
  updatePortfolioValidation,
  createProjectValidation,
  updateProjectValidation,
  updateUserValidation,
  searchValidation,
  idParamValidation,
  slugParamValidation
};
