import express from 'express';

import {
  getTestimonials,
  searchTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialsController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';

import {
  validateRequiredFields,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/testimonials
 * @desc    Get all active testimonials
 * @access  Public
 */
router.get('/', getTestimonials);

/**
 * @route   GET /api/testimonials/search?keyword=value
 * @desc    Search testimonials
 * @access  Public
 */
router.get('/search', searchTestimonials);

/**
 * @route   GET /api/testimonials/:id
 * @desc    Get one testimonial by ID
 * @access  Public
 */
router.get('/:id', getTestimonialById);

/**
 * @route   POST /api/testimonials
 * @desc    Create new testimonial
 * @access  Private/Admin
 */
router.post(
  '/',
  protect,
  adminOnly,
  validateRequiredFields(['customer_name', 'message']),
  createTestimonial
);

/**
 * @route   PUT /api/testimonials/:id
 * @desc    Update testimonial
 * @access  Private/Admin
 */
router.put(
  '/:id',
  protect,
  adminOnly,
  validateRequiredFields(['customer_name', 'message']),
  updateTestimonial
);

/**
 * @route   DELETE /api/testimonials/:id
 * @desc    Delete testimonial
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  protect,
  adminOnly,
  deleteTestimonial
);

export default router;