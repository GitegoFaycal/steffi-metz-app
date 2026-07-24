import express from 'express';

import {
  getSettings,
  updateSettings,
  updateSettingsLogo,
  updateShopImage,
} from '../controllers/settingsController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { uploadTo } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getSettings);

router.put(
  '/',
  protect,
  adminOnly,
  updateSettings
);

router.put(
  '/logo',
  protect,
  adminOnly,
  uploadTo('settings').single('logo'),
  updateSettingsLogo
);

router.put(
  '/shop-image',
  protect,
  adminOnly,
  uploadTo('settings').single('shop_image'),
  updateShopImage
);

export default router;