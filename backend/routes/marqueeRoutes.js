import express from 'express';

import {
  getMarqueeItems,
  getAllMarqueeItems,
  createMarqueeItem,
  updateMarqueeItem,
  deleteMarqueeItem,
} from '../controllers/marqueeController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';

import {
  validateRequiredFields,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/', getMarqueeItems);

router.get(
  '/admin',
  protect,
  adminOnly,
  getAllMarqueeItems
);

router.post(
  '/',
  protect,
  adminOnly,
  validateRequiredFields(['text']),
  createMarqueeItem
);

router.put(
  '/:id',
  protect,
  adminOnly,
  validateRequiredFields(['text']),
  updateMarqueeItem
);

router.delete(
  '/:id',
  protect,
  adminOnly,
  deleteMarqueeItem
);

export default router;