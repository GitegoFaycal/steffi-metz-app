import express from 'express';

import {
  createPayment,
  getPayments,
  getPaymentById,
  deletePayment,
} from '../controllers/paymentsController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';

import {
  validateRequiredFields,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/payments
 * @desc    Create payment record
 * @access  Public
 */
router.post(
  '/',
  validateRequiredFields(['amount', 'method']),
  createPayment
);

/**
 * @route   GET /api/payments
 * @desc    Get all payments
 * @access  Private/Admin
 */
router.get(
  '/',
  protect,
  adminOnly,
  getPayments
);

/**
 * @route   GET /api/payments/:id
 * @desc    Get one payment
 * @access  Private/Admin
 */
router.get(
  '/:id',
  protect,
  adminOnly,
  getPaymentById
);

/**
 * @route   DELETE /api/payments/:id
 * @desc    Delete payment
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  protect,
  adminOnly,
  deletePayment
);

export default router;