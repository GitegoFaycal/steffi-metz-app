import express from 'express';

import {
  getLoyaltyTiers,
  getAllLoyaltyTiers,
  getLoyaltyTierById,
  createLoyaltyTier,
  updateLoyaltyTier,
  deleteLoyaltyTier,
} from '../controllers/loyaltyController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';

import {
  validateRequiredFields,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/loyalty
 * @desc    Get active loyalty tiers
 * @access  Public
 */
router.get('/', getLoyaltyTiers);

/**
 * @route   GET /api/loyalty/admin
 * @desc    Get all loyalty tiers
 * @access  Private/Admin
 */
router.get(
  '/admin',
  protect,
  adminOnly,
  getAllLoyaltyTiers
);

/**
 * @route   GET /api/loyalty/:id
 * @desc    Get one loyalty tier
 * @access  Public
 */
router.get('/:id', getLoyaltyTierById);

/**
 * @route   POST /api/loyalty
 * @desc    Create loyalty tier
 * @access  Private/Admin
 */
router.post(
  '/',
  protect,
  adminOnly,
  validateRequiredFields(['name', 'discount']),
  createLoyaltyTier
);

/**
 * @route   PUT /api/loyalty/:id
 * @desc    Update loyalty tier
 * @access  Private/Admin
 */
router.put(
  '/:id',
  protect,
  adminOnly,
  validateRequiredFields(['name', 'discount']),
  updateLoyaltyTier
);

/**
 * @route   DELETE /api/loyalty/:id
 * @desc    Delete loyalty tier
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  protect,
  adminOnly,
  deleteLoyaltyTier
);

export default router;