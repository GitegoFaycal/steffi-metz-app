import express from 'express';

import {
  createOrder,
  getOrders,
  searchOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderPaymentStatus,
  deleteOrder,
} from '../controllers/ordersController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';

import {
  validateRequiredFields,
  validateEmail,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/orders
 * @desc    Create public customer order
 * @access  Public
 */
router.post(
  '/',
  validateRequiredFields(['phone', 'item']),
  createOrder
);

/**
 * @route   GET /api/orders
 * @desc    Get all orders
 * @access  Private/Admin
 */
router.get(
  '/',
  protect,
  adminOnly,
  getOrders
);

/**
 * @route   GET /api/orders/search?keyword=value
 * @desc    Search orders
 * @access  Private/Admin
 */
router.get(
  '/search',
  protect,
  adminOnly,
  searchOrders
);

/**
 * @route   GET /api/orders/:id
 * @desc    Get one order
 * @access  Private/Admin
 */
router.get(
  '/:id',
  protect,
  adminOnly,
  getOrderById
);

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status
 * @access  Private/Admin
 */
router.put(
  '/:id/status',
  protect,
  adminOnly,
  validateRequiredFields(['status']),
  updateOrderStatus
);

/**
 * @route   PUT /api/orders/:id/payment-status
 * @desc    Update order payment status
 * @access  Private/Admin
 */
router.put(
  '/:id/payment-status',
  protect,
  adminOnly,
  validateRequiredFields(['payment_status']),
  updateOrderPaymentStatus
);

/**
 * @route   DELETE /api/orders/:id
 * @desc    Delete order
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  protect,
  adminOnly,
  deleteOrder
);

export default router;