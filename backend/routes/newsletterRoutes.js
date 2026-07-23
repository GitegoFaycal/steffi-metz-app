import express from 'express';

import {
  subscribeNewsletter,
  getNewsletters,
  searchNewsletters,
  deleteNewsletter,
} from '../controllers/newsletterController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';

import {
  validateRequiredFields,
  validateEmail,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/newsletters
 * @desc    Subscribe to newsletter
 * @access  Public
 */
router.post(
  '/',
  validateRequiredFields(['email']),
  validateEmail,
  subscribeNewsletter
);

/**
 * @route   GET /api/newsletters
 * @desc    Get all newsletter subscribers
 * @access  Private/Admin
 */
router.get(
  '/',
  protect,
  adminOnly,
  getNewsletters
);

/**
 * @route   GET /api/newsletters/search?keyword=value
 * @desc    Search newsletter subscribers
 * @access  Private/Admin
 */
router.get(
  '/search',
  protect,
  adminOnly,
  searchNewsletters
);

/**
 * @route   DELETE /api/newsletters/:id
 * @desc    Delete newsletter subscriber
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  protect,
  adminOnly,
  deleteNewsletter
);

export default router;