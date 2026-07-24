import db from '../config/db.js';

export async function getMarqueeItems(req, res) {
  try {
    const [items] = await db.query(
      'SELECT * FROM marquee_items WHERE status = "active" ORDER BY sort_order ASC, id ASC'
    );

    return res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    console.error('GET MARQUEE ITEMS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load marquee items.',
      error: error.message,
    });
  }
}

export async function getAllMarqueeItems(req, res) {
  try {
    const [items] = await db.query(
      'SELECT * FROM marquee_items ORDER BY sort_order ASC, id ASC'
    );

    return res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    console.error('GET ALL MARQUEE ITEMS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load marquee items.',
      error: error.message,
    });
  }
}

export async function createMarqueeItem(req, res) {
  try {
    const { text, sort_order, status } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO marquee_items (
        text,
        sort_order,
        status
      )
      VALUES (?, ?, ?)
      `,
      [
        text,
        sort_order || 0,
        status || 'active',
      ]
    );

    const [newRows] = await db.query(
      'SELECT * FROM marquee_items WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: 'Marquee item created successfully.',
      item: newRows[0],
    });
  } catch (error) {
    console.error('CREATE MARQUEE ITEM ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to create marquee item.',
      error: error.message,
    });
  }
}

export async function updateMarqueeItem(req, res) {
  try {
    const { id } = req.params;
    const { text, sort_order, status } = req.body;

    const [existingRows] = await db.query(
      'SELECT * FROM marquee_items WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Marquee item not found.',
      });
    }

    const existingItem = existingRows[0];

    await db.query(
      `
      UPDATE marquee_items
      SET
        text = ?,
        sort_order = ?,
        status = ?
      WHERE id = ?
      `,
      [
        text,
        sort_order ?? existingItem.sort_order ?? 0,
        status || existingItem.status || 'active',
        id,
      ]
    );

    const [updatedRows] = await db.query(
      'SELECT * FROM marquee_items WHERE id = ?',
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'Marquee item updated successfully.',
      item: updatedRows[0],
    });
  } catch (error) {
    console.error('UPDATE MARQUEE ITEM ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update marquee item.',
      error: error.message,
    });
  }
}

export async function deleteMarqueeItem(req, res) {
  try {
    const { id } = req.params;

    const [existingRows] = await db.query(
      'SELECT * FROM marquee_items WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Marquee item not found.',
      });
    }

    await db.query(
      'DELETE FROM marquee_items WHERE id = ?',
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'Marquee item deleted successfully.',
    });
  } catch (error) {
    console.error('DELETE MARQUEE ITEM ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete marquee item.',
      error: error.message,
    });
  }
}