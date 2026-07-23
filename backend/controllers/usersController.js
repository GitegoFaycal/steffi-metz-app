import bcrypt from 'bcryptjs';
import db from '../config/db.js';

/**
 * GET /api/users
 * Private/admin route
 * Get all users
 */
export async function getUsers(req, res) {
  try {
    const [users] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        role,
        created_at,
        updated_at
      FROM users
      ORDER BY id DESC
      `
    );

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('GET USERS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load users.',
      error: error.message,
    });
  }
}

/**
 * GET /api/users/search?keyword=value
 * Private/admin route
 * Search users
 */
export async function searchUsers(req, res) {
  try {
    const keyword = req.query.keyword || '';

    const [users] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        role,
        created_at,
        updated_at
      FROM users
      WHERE
        name LIKE ?
        OR email LIKE ?
        OR role LIKE ?
      ORDER BY id DESC
      `,
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
    );

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('SEARCH USERS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to search users.',
      error: error.message,
    });
  }
}

/**
 * GET /api/users/:id
 * Private/admin route
 * Get one user by ID
 */
export async function getUserById(req, res) {
  try {
    const { id } = req.params;

    const [users] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        role,
        created_at,
        updated_at
      FROM users
      WHERE id = ?
      `,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      user: users[0],
    });
  } catch (error) {
    console.error('GET USER BY ID ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load user.',
      error: error.message,
    });
  }
}

/**
 * POST /api/users
 * Private/admin route
 * Create new user
 */
export async function createUser(req, res) {
  try {
    const { name, email, password, role } = req.body;

    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email is already used by another user.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `
      INSERT INTO users (
        name,
        email,
        password,
        role
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        name,
        email,
        hashedPassword,
        role || 'editor',
      ]
    );

    const [newUserRows] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        role,
        created_at,
        updated_at
      FROM users
      WHERE id = ?
      `,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: 'User created successfully.',
      user: newUserRows[0],
    });
  } catch (error) {
    console.error('CREATE USER ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to create user.',
      error: error.message,
    });
  }
}

/**
 * PUT /api/users/:id
 * Private/admin route
 * Update user details except password
 */
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const [existingRows] = await db.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const [emailRows] = await db.query(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, id]
    );

    if (emailRows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email is already used by another user.',
      });
    }

    await db.query(
      `
      UPDATE users
      SET
        name = ?,
        email = ?,
        role = ?
      WHERE id = ?
      `,
      [
        name,
        email,
        role || existingRows[0].role || 'editor',
        id,
      ]
    );

    const [updatedRows] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        role,
        created_at,
        updated_at
      FROM users
      WHERE id = ?
      `,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      user: updatedRows[0],
    });
  } catch (error) {
    console.error('UPDATE USER ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update user.',
      error: error.message,
    });
  }
}

/**
 * PUT /api/users/:id/password
 * Private/admin route
 * Update user password
 */
export async function updateUserPassword(req, res) {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const [existingRows] = await db.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );

    return res.status(200).json({
      success: true,
      message: 'User password updated successfully.',
    });
  } catch (error) {
    console.error('UPDATE USER PASSWORD ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update user password.',
      error: error.message,
    });
  }
}

/**
 * DELETE /api/users/:id
 * Private/admin route
 * Delete user
 */
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (Number(req.user.id) === Number(id)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account while logged in.',
      });
    }

    const [existingRows] = await db.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    await db.query(
      'DELETE FROM users WHERE id = ?',
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (error) {
    console.error('DELETE USER ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete user.',
      error: error.message,
    });
  }
}