import express from 'express';

import {
  getGallery,
  uploadGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from '../controllers/galleryController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { uploadTo } from '../middleware/uploadMiddleware.js';

import {
  validateRequiredFields,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/gallery
 * @desc    Get all gallery images
 * @access  Public
 */
router.get('/', getGallery);

/**
 * @route   POST /api/gallery
 * @desc    Upload new gallery image
 * @access  Private/Admin
 */
router.post(
  '/',
  protect,
  adminOnly,
  uploadTo('gallery').single('image'),
  validateRequiredFields(['title']),
  uploadGalleryImage
);

/**
 * @route   PUT /api/gallery/:id
 * @desc    Update gallery image
 * @access  Private/Admin
 */
router.put(
  '/:id',
  protect,
  adminOnly,
  uploadTo('gallery').single('image'),
  validateRequiredFields(['title']),
  updateGalleryImage
);

/**
 * @route   DELETE /api/gallery/:id
 * @desc    Delete gallery image
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  protect,
  adminOnly,
  deleteGalleryImage
);

export default router;