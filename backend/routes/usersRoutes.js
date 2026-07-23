import express from 'express';

import {
  getUsers,
  searchUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
} from '../controllers/usersController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';

import {
  validateRequiredFields,
  validateEmail,
  validatePassword,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private/Admin
 */
router.get(
  '/',
  protect,
  adminOnly,
  getUsers
);

/**
 * @route   GET /api/users/search?keyword=value
 * @desc    Search users
 * @access  Private/Admin
 */
router.get(
  '/search',
  protect,
  adminOnly,
  searchUsers
);

/**
 * @route   GET /api/users/:id
 * @desc    Get one user
 * @access  Private/Admin
 */
router.get(
  '/:id',
  protect,
  adminOnly,
  getUserById
);

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Private/Admin
 */
router.post(
  '/',
  protect,
  adminOnly,
  validateRequiredFields(['name', 'email', 'password']),
  validateEmail,
  validatePassword,
  createUser
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user details
 * @access  Private/Admin
 */
router.put(
  '/:id',
  protect,
  adminOnly,
  validateRequiredFields(['name', 'email']),
  validateEmail,
  updateUser
);

/**
 * @route   PUT /api/users/:id/password
 * @desc    Update user password
 * @access  Private/Admin
 */
router.put(
  '/:id/password',
  protect,
  adminOnly,
  validateRequiredFields(['password']),
  validatePassword,
  updateUserPassword
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  protect,
  adminOnly,
  deleteUser
);

export default router;