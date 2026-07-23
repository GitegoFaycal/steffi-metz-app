import db from '../config/db.js';
import deleteFile from '../utils/deleteFile.js';

/**
 * GET /api/boxes
 * Public route
 * Get all active boxes
 */
export async function getBoxes(req, res) {
  try {
    const [boxes] = await db.query(
      'SELECT * FROM boxes WHERE status = "active" ORDER BY id DESC'
    );

    const formattedBoxes = boxes.map((box) => ({
      ...box,
      items: box.items
        ? box.items.split(',').map((item) => item.trim())
        : [],
    }));

    return res.status(200).json({
      success: true,
      boxes: formattedBoxes,
    });
  } catch (error) {
    console.error('GET BOXES ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load boxes.',
      error: error.message,
    });
  }
};


/**
 * GET /api/boxes/search?keyword=value
 * Public route
 * Search boxes
 */
export async function searchBoxes(req, res) {
  try {
    const keyword = req.query.keyword || '';

    const [boxes] = await db.query(
      `
      SELECT * FROM boxes
      WHERE
        name LIKE ?
        OR price LIKE ?
        OR serves LIKE ?
        OR items LIKE ?
      ORDER BY id DESC
      `,
      [
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
      ]
    );

    const formattedBoxes = boxes.map((box) => ({
      ...box,
      items: box.items
        ? box.items.split(',').map((item) => item.trim())
        : [],
    }));

    return res.status(200).json({
      success: true,
      boxes: formattedBoxes,
    });

  } catch (error) {
    console.error('SEARCH BOXES ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to search boxes.',
      error: error.message,
    });
  }
};


/**
 * GET /api/boxes/:id
 * Public route
 * Get one box by ID
 */
export async function getBoxById(req, res) {
  try {
    const { id } = req.params;

    const [boxes] = await db.query(
      'SELECT * FROM boxes WHERE id = ?',
      [id]
    );

    if (boxes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Box not found.',
      });
    }

    const box = boxes[0];

    return res.status(200).json({
      success: true,
      box: {
        ...box,
        items: box.items
          ? box.items.split(',').map((item) => item.trim())
          : [],
      },
    });

  } catch (error) {
    console.error('GET BOX BY ID ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load box.',
      error: error.message,
    });
  }
};


/**
 * POST /api/boxes
 * Private/admin route
 * Create new box with optional image upload
 */
export async function createBox(req, res) {
  try {
    const {
      name,
      price,
      serves,
      items,
      status
    } = req.body;


    const image = req.file
      ? `/uploads/boxes/${req.file.filename}`
      : null;


    const formattedItems = Array.isArray(items)
      ? items.join(', ')
      : items || '';


    const [result] = await db.query(
      `
      INSERT INTO boxes (
        name,
        price,
        serves,
        items,
        image,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        name,
        price,
        serves || '',
        formattedItems,
        image,
        status || 'active',
      ]
    );


    const [newBoxRows] = await db.query(
      'SELECT * FROM boxes WHERE id = ?',
      [result.insertId]
    );


    const box = newBoxRows[0];


    return res.status(201).json({
      success: true,
      message: 'Box created successfully.',
      box: {
        ...box,
        items: box.items
          ? box.items.split(',').map((item) => item.trim())
          : [],
      },
    });


  } catch (error) {

    console.error('CREATE BOX ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to create box.',
      error: error.message,
    });
  }
};


/**
 * PUT /api/boxes/:id
 * Private/admin route
 * Update box
 */
export async function updateBox(req, res) {

  try {

    const { id } = req.params;

    const {
      name,
      price,
      serves,
      items,
      status
    } = req.body;


    const [existingRows] = await db.query(
      'SELECT * FROM boxes WHERE id = ?',
      [id]
    );


    if (existingRows.length === 0) {

      return res.status(404).json({
        success: false,
        message: 'Box not found.',
      });

    }


    const existingBox = existingRows[0];


    const newImage = req.file
      ? `/uploads/boxes/${req.file.filename}`
      : null;


    if (
      newImage &&
      existingBox.image &&
      existingBox.image.startsWith('/uploads/')
    ) {

      deleteFile(existingBox.image);

    }


    const finalImage = newImage || existingBox.image;


    const formattedItems = Array.isArray(items)
      ? items.join(', ')
      : items || '';



    await db.query(
      `
      UPDATE boxes
      SET
        name = ?,
        price = ?,
        serves = ?,
        items = ?,
        image = ?,
        status = ?
      WHERE id = ?
      `,
      [
        name,
        price,
        serves || '',
        formattedItems,
        finalImage,
        status || existingBox.status || 'active',
        id,
      ]
    );


    const [updatedRows] = await db.query(
      'SELECT * FROM boxes WHERE id = ?',
      [id]
    );


    const updatedBox = updatedRows[0];


    return res.status(200).json({
      success: true,
      message: 'Box updated successfully.',
      box: {
        ...updatedBox,
        items: updatedBox.items
          ? updatedBox.items.split(',').map((item) => item.trim())
          : [],
      },
    });


  } catch (error) {

    console.error('UPDATE BOX ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update box.',
      error: error.message,
    });

  }

};


/**
 * DELETE /api/boxes/:id
 * Private/admin route
 * Delete box and uploaded image
 */
export async function deleteBox(req, res) {

  try {

    const { id } = req.params;


    const [existingRows] = await db.query(
      'SELECT * FROM boxes WHERE id = ?',
      [id]
    );


    if (existingRows.length === 0) {

      return res.status(404).json({
        success: false,
        message: 'Box not found.',
      });

    }


    const box = existingRows[0];


    if (box.image && box.image.startsWith('/uploads/')) {

      deleteFile(box.image);

    }


    await db.query(
      'DELETE FROM boxes WHERE id = ?',
      [id]
    );


    return res.status(200).json({
      success: true,
      message: 'Box deleted successfully.',
    });


  } catch (error) {

    console.error('DELETE BOX ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete box.',
      error: error.message,
    });

  }

};