import db from '../config/db.js';

/**
 * POST /api/contact-messages
 * Public route
 * Create/send contact message
 */
export async function createContactMessage(req, res) {
  try {
    const { name, email, phone, subject, message } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO contact_messages (
        name,
        email,
        phone,
        subject,
        message
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        name,
        email,
        phone || '',
        subject || '',
        message,
      ]
    );

    const [newRows] = await db.query(
      'SELECT * FROM contact_messages WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: 'Contact message sent successfully.',
      contactMessage: newRows[0],
    });
  } catch (error) {
    console.error('CREATE CONTACT MESSAGE ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to send contact message.',
      error: error.message,
    });
  }
}

/**
 * GET /api/contact-messages
 * Private/admin route
 * Get all contact messages
 */
export async function getContactMessages(req, res) {
  try {
    const [messages] = await db.query(
      'SELECT * FROM contact_messages ORDER BY id DESC'
    );

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error('GET CONTACT MESSAGES ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load contact messages.',
      error: error.message,
    });
  }
}

/**
 * GET /api/contact-messages/search?keyword=value
 * Private/admin route
 * Search contact messages
 */
export async function searchContactMessages(req, res) {
  try {
    const keyword = req.query.keyword || '';

    const [messages] = await db.query(
      `
      SELECT * FROM contact_messages
      WHERE
        name LIKE ?
        OR email LIKE ?
        OR phone LIKE ?
        OR subject LIKE ?
        OR message LIKE ?
      ORDER BY id DESC
      `,
      [
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
      ]
    );

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error('SEARCH CONTACT MESSAGES ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to search contact messages.',
      error: error.message,
    });
  }
}

/**
 * GET /api/contact-messages/:id
 * Private/admin route
 * Get one contact message
 */
export async function getContactMessageById(req, res) {
  try {
    const { id } = req.params;

    const [messages] = await db.query(
      'SELECT * FROM contact_messages WHERE id = ?',
      [id]
    );

    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found.',
      });
    }

    return res.status(200).json({
      success: true,
      contactMessage: messages[0],
    });
  } catch (error) {
    console.error('GET CONTACT MESSAGE BY ID ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load contact message.',
      error: error.message,
    });
  }
}

/**
 * PUT /api/contact-messages/:id/read
 * Private/admin route
 * Mark contact message as read
 */
export async function markContactMessageAsRead(req, res) {
  try {
    const { id } = req.params;

    const [existingRows] = await db.query(
      'SELECT * FROM contact_messages WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found.',
      });
    }

    await db.query(
      'UPDATE contact_messages SET is_read = TRUE WHERE id = ?',
      [id]
    );

    const [updatedRows] = await db.query(
      'SELECT * FROM contact_messages WHERE id = ?',
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'Contact message marked as read.',
      contactMessage: updatedRows[0],
    });
  } catch (error) {
    console.error('MARK CONTACT MESSAGE AS READ ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to mark contact message as read.',
      error: error.message,
    });
  }
}

/**
 * DELETE /api/contact-messages/:id
 * Private/admin route
 * Delete contact message
 */
export async function deleteContactMessage(req, res) {
  try {
    const { id } = req.params;

    const [existingRows] = await db.query(
      'SELECT * FROM contact_messages WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found.',
      });
    }

    await db.query(
      'DELETE FROM contact_messages WHERE id = ?',
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'Contact message deleted successfully.',
    });
  } catch (error) {
    console.error('DELETE CONTACT MESSAGE ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete contact message.',
      error: error.message,
    });
  }
}