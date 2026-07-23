import express from 'express';

import {
  createContactMessage,
  getContactMessages,
  searchContactMessages,
  getContactMessageById,
  markContactMessageAsRead,
  deleteContactMessage,
} from '../controllers/contactController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';

import {
  validateRequiredFields,
  validateEmail,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/contact-messages
 * @desc    Public website contact form submission
 * @access  Public
 */
router.post(
  '/',
  validateRequiredFields(['name', 'email', 'message']),
  validateEmail,
  createContactMessage
);

/**
 * @route   GET /api/contact-messages
 * @desc    Get all contact messages
 * @access  Private/Admin
 */
router.get(
  '/',
  protect,
  adminOnly,
  getContactMessages
);

/**
 * @route   GET /api/contact-messages/search?keyword=value
 * @desc    Search contact messages
 * @access  Private/Admin
 */
router.get(
  '/search',
  protect,
  adminOnly,
  searchContactMessages
);

/**
 * @route   GET /api/contact-messages/:id
 * @desc    Get one contact message
 * @access  Private/Admin
 */
router.get(
  '/:id',
  protect,
  adminOnly,
  getContactMessageById
);

/**
 * @route   PUT /api/contact-messages/:id/read
 * @desc    Mark message as read
 * @access  Private/Admin
 */
router.put(
  '/:id/read',
  protect,
  adminOnly,
  markContactMessageAsRead
);

/**
 * @route   DELETE /api/contact-messages/:id
 * @desc    Delete contact message
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  protect,
  adminOnly,
  deleteContactMessage
);

export default router;