import db from '../config/db.js';
import deleteFile from '../utils/deleteFile.js';
import getUploadedFileUrl from '../utils/getUploadedFileUrl.js';
import addImageToGallery from '../utils/addImageToGallery.js';

function formatBox(box) {
  return {
    ...box,
    items: box.items
      ? box.items.split(',').map((item) => item.trim())
      : [],
  };
}

function formatItemsForDatabase(items, fallback = '') {
  if (Array.isArray(items)) {
    return items.join(', ');
  }

  if (typeof items === 'string') {
    return items;
  }

  return fallback;
}

export async function getBoxes(req, res) {
  try {
    const [boxes] = await db.query(
      'SELECT * FROM boxes WHERE status = "active" ORDER BY id DESC'
    );

    return res.status(200).json({
      success: true,
      boxes: boxes.map(formatBox),
    });
  } catch (error) {
    console.error('GET BOXES ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load boxes.',
      error: error.message,
    });
  }
}

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

    return res.status(200).json({
      success: true,
      boxes: boxes.map(formatBox),
    });
  } catch (error) {
    console.error('SEARCH BOXES ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to search boxes.',
      error: error.message,
    });
  }
}

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

    return res.status(200).json({
      success: true,
      box: formatBox(boxes[0]),
    });
  } catch (error) {
    console.error('GET BOX BY ID ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load box.',
      error: error.message,
    });
  }
}

export async function createBox(req, res) {
  try {
    const {
      name,
      price,
      serves,
      items,
      status,
    } = req.body;

    const image = req.file
      ? getUploadedFileUrl(req.file)
      : null;

    if (image) {
      await addImageToGallery({
        title: `Box Image - ${name}`,
        category: 'boxes',
        image,
      });
    }

    const formattedItems = formatItemsForDatabase(items);

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

    return res.status(201).json({
      success: true,
      message: 'Box created successfully.',
      box: formatBox(newBoxRows[0]),
    });
  } catch (error) {
    console.error('CREATE BOX ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to create box.',
      error: error.message,
    });
  }
}

export async function updateBox(req, res) {
  try {
    const { id } = req.params;

    const {
      name,
      price,
      serves,
      items,
      status,
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
      ? getUploadedFileUrl(req.file)
      : null;

    if (newImage && existingBox.image) {
      deleteFile(existingBox.image);
    }

    if (newImage) {
      await addImageToGallery({
        title: `Box Image - ${name || existingBox.name}`,
        category: 'boxes',
        image: newImage,
      });
    }

    const finalImage = newImage || existingBox.image;

    const formattedItems = formatItemsForDatabase(
      items,
      existingBox.items || ''
    );

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
        name || existingBox.name,
        price || existingBox.price,
        serves || existingBox.serves || '',
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

    return res.status(200).json({
      success: true,
      message: 'Box updated successfully.',
      box: formatBox(updatedRows[0]),
    });
  } catch (error) {
    console.error('UPDATE BOX ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update box.',
      error: error.message,
    });
  }
}

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

    if (box.image) {
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
}