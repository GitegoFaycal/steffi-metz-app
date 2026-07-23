import express from 'express';

import {
  getAbout,
  updateAbout,
  updateAboutWithImage,
} from '../controllers/aboutController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { uploadTo } from '../middleware/uploadMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/about
 * @desc    Get about section content
 * @access  Public
 */
router.get('/', getAbout);

/**
 * @route   PUT /api/about
 * @desc    Update about text content
 * @access  Private/Admin
 */
router.put('/', protect, adminOnly, updateAbout);

/**
 * @route   PUT /api/about/upload
 * @desc    Update about content with images
 * @access  Private/Admin
 */
router.put(
  '/upload',
  protect,
  adminOnly,
  uploadTo('about').fields([
    { name: 'image_one', maxCount: 1 },
    { name: 'image_two', maxCount: 1 },
  ]),
  updateAboutWithImage
);

export default router;