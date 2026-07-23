import express from 'express';

import {
  getSettings,
  updateSettings,
  updateSettingsLogo,
} from '../controllers/settingsController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { uploadTo } from '../middleware/uploadMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/settings
 * @desc    Get website settings
 * @access  Public
 */
router.get('/', getSettings);

/**
 * @route   PUT /api/settings
 * @desc    Update website settings
 * @access  Private/Admin
 */
router.put(
  '/',
  protect,
  adminOnly,
  updateSettings
);

/**
 * @route   PUT /api/settings/logo
 * @desc    Update website logo
 * @access  Private/Admin
 */
router.put(
  '/logo',
  protect,
  adminOnly,
  uploadTo('settings').single('logo'),
  updateSettingsLogo
);

export default router;