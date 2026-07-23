import express from 'express';

import {
  getHomepage,
  updateHomepage,
  updateHomepageWithImage,
} from '../controllers/homepageController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { uploadTo } from '../middleware/uploadMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/homepage
 * @desc    Get homepage content
 * @access  Public
 */
router.get('/', getHomepage);

/**
 * @route   PUT /api/homepage
 * @desc    Update homepage text content
 * @access  Private/Admin
 */
router.put('/', protect, adminOnly, updateHomepage);

/**
 * @route   PUT /api/homepage/upload
 * @desc    Update homepage content with hero image
 * @access  Private/Admin
 */
router.put(
  '/upload',
  protect,
  adminOnly,
  uploadTo('homepage').single('hero_image'),
  updateHomepageWithImage
);

export default router;