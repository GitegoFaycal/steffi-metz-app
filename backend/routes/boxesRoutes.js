import express from 'express';

import {
  getBoxes,
  searchBoxes,
  getBoxById,
  createBox,
  updateBox,
  deleteBox,
} from '../controllers/boxesController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { uploadTo } from '../middleware/uploadMiddleware.js';

import {
  validateRequiredFields,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/boxes
 * @desc    Get all active boxes
 * @access  Public
 */
router.get('/', getBoxes);

/**
 * @route   GET /api/boxes/search?keyword=value
 * @desc    Search boxes
 * @access  Public
 */
router.get('/search', searchBoxes);

/**
 * @route   GET /api/boxes/:id
 * @desc    Get one box by ID
 * @access  Public
 */
router.get('/:id', getBoxById);

/**
 * @route   POST /api/boxes
 * @desc    Create new box with image upload
 * @access  Private/Admin
 */
router.post(
  '/',
  protect,
  adminOnly,
  uploadTo('boxes').single('image'),
  validateRequiredFields(['name', 'price']),
  createBox
);

/**
 * @route   PUT /api/boxes/:id
 * @desc    Update box with optional image upload
 * @access  Private/Admin
 */
router.put(
  '/:id',
  protect,
  adminOnly,
  uploadTo('boxes').single('image'),
  validateRequiredFields(['name', 'price']),
  updateBox
);

/**
 * @route   DELETE /api/boxes/:id
 * @desc    Delete box
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  protect,
  adminOnly,
  deleteBox
);

export default router;