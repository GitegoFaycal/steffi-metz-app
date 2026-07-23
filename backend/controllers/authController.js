import bcrypt from 'bcryptjs';
import db from '../config/db.js';
import generateToken from '../utils/generateToken.js';

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const [users] = await db.query(
      'SELECT id, name, email, password, role FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Login failed.',
      error: error.message,
    });
  }
}

export async function getMe(req, res) {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to get admin profile.',
      error: error.message,
    });
  }
}

export async function createInitialAdmin(req, res) {
  try {
    const [existingUsers] = await db.query('SELECT id FROM users LIMIT 1');

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Admin user already exists.',
      });
    }

    const name = 'Admin User';
    const email = 'admin@steffi.com';
    const plainPassword = 'admin123';
    const role = 'admin';

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    return res.status(201).json({
      success: true,
      message: 'Initial admin created successfully.',
      admin: {
        id: result.insertId,
        name,
        email,
        role,
      },
      login: {
        email,
        password: plainPassword,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create initial admin.',
      error: error.message,
    });
  }
}