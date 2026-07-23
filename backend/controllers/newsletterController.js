import db from '../config/db.js';

/**
 * POST /api/newsletters
 * Public route
 * Subscribe to newsletter
 */
export async function subscribeNewsletter(req, res) {
  try {
    const { email } = req.body;

    const [existingSubscribers] = await db.query(
      'SELECT * FROM newsletters WHERE email = ?',
      [email]
    );

    if (existingSubscribers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed.',
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO newsletters (
        email
      )
      VALUES (?)
      `,
      [email]
    );

    const [newRows] = await db.query(
      'SELECT * FROM newsletters WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: 'Newsletter subscription successful.',
      subscriber: newRows[0],
    });
  } catch (error) {
    console.error('SUBSCRIBE NEWSLETTER ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to subscribe to newsletter.',
      error: error.message,
    });
  }
}

/**
 * GET /api/newsletters
 * Private/admin route
 * Get all newsletter subscribers
 */
export async function getNewsletters(req, res) {
  try {
    const [newsletters] = await db.query(
      'SELECT * FROM newsletters ORDER BY id DESC'
    );

    return res.status(200).json({
      success: true,
      newsletters,
    });
  } catch (error) {
    console.error('GET NEWSLETTERS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load newsletter subscribers.',
      error: error.message,
    });
  }
}

/**
 * GET /api/newsletters/search?keyword=value
 * Private/admin route
 * Search newsletter subscribers
 */
export async function searchNewsletters(req, res) {
  try {
    const keyword = req.query.keyword || '';

    const [newsletters] = await db.query(
      `
      SELECT * FROM newsletters
      WHERE email LIKE ?
      ORDER BY id DESC
      `,
      [`%${keyword}%`]
    );

    return res.status(200).json({
      success: true,
      newsletters,
    });
  } catch (error) {
    console.error('SEARCH NEWSLETTERS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to search newsletter subscribers.',
      error: error.message,
    });
  }
}

/**
 * DELETE /api/newsletters/:id
 * Private/admin route
 * Delete newsletter subscriber
 */
export async function deleteNewsletter(req, res) {
  try {
    const { id } = req.params;

    const [existingRows] = await db.query(
      'SELECT * FROM newsletters WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Newsletter subscriber not found.',
      });
    }

    await db.query(
      'DELETE FROM newsletters WHERE id = ?',
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'Newsletter subscriber deleted successfully.',
    });
  } catch (error) {
    console.error('DELETE NEWSLETTER ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete newsletter subscriber.',
      error: error.message,
    });
  }
}