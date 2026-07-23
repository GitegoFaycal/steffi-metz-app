import express from 'express';

import {
  getEvents,
  searchEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventsController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { uploadTo } from '../middleware/uploadMiddleware.js';

import {
  validateRequiredFields,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/events
 * @desc    Get all active events
 * @access  Public
 */
router.get('/', getEvents);

/**
 * @route   GET /api/events/search?keyword=value
 * @desc    Search events
 * @access  Public
 */
router.get('/search', searchEvents);

/**
 * @route   GET /api/events/:id
 * @desc    Get one event by ID
 * @access  Public
 */
router.get('/:id', getEventById);

/**
 * @route   POST /api/events
 * @desc    Create new event with image upload
 * @access  Private/Admin
 */
router.post(
  '/',
  protect,
  adminOnly,
  uploadTo('events').single('image'),
  validateRequiredFields(['title']),
  createEvent
);

/**
 * @route   PUT /api/events/:id
 * @desc    Update event with optional image upload
 * @access  Private/Admin
 */
router.put(
  '/:id',
  protect,
  adminOnly,
  uploadTo('events').single('image'),
  validateRequiredFields(['title']),
  updateEvent
);

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete event
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  protect,
  adminOnly,
  deleteEvent
);

export default router;