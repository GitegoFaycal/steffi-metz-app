import express from 'express';
import {
  login,
  getMe,
  createInitialAdmin,
} from '../controllers/authController.js';

import { protect } from '../middleware/authMiddleware.js';

import {
  validateRequiredFields,
  validateEmail,
  validatePassword,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Login admin/user
 * @access  Public
 */
router.post(
  '/login',
  validateRequiredFields(['email', 'password']),
  validateEmail,
  login
);

/**
 * @route   GET /api/auth/me
 * @desc    Get logged-in admin/user profile
 * @access  Private
 */
router.get('/me', protect, getMe);

/**
 * @route   POST /api/auth/setup-admin
 * @desc    Create first admin user if users table is empty
 * @access  Public, only works once
 */
router.post(
  '/setup-admin',
  validateRequiredFields(['password']),
  validatePassword,
  createInitialAdmin
);

export default router;