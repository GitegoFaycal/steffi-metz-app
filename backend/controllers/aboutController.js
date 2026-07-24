import db from '../config/db.js';
import deleteFile from '../utils/deleteFile.js';
import getUploadedFileUrl from '../utils/getUploadedFileUrl.js';

export async function getAbout(req, res) {
  try {
    const [rows] = await db.query(
      'SELECT * FROM about ORDER BY id ASC LIMIT 1'
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'About content not found.',
      });
    }

    return res.status(200).json({
      success: true,
      about: rows[0],
    });
  } catch (error) {
    console.error('GET ABOUT ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load about content.',
      error: error.message,
    });
  }
}

export async function updateAbout(req, res) {
  try {
    const {
      eyebrow,
      title,
      description,
      quote,
    } = req.body;

    const [existingRows] = await db.query(
      'SELECT * FROM about ORDER BY id ASC LIMIT 1'
    );

    if (existingRows.length === 0) {
      const [result] = await db.query(
        `
        INSERT INTO about (
          eyebrow,
          title,
          description,
          quote
        )
        VALUES (?, ?, ?, ?)
        `,
        [
          eyebrow || '',
          title || '',
          description || '',
          quote || '',
        ]
      );

      const [newRows] = await db.query(
        'SELECT * FROM about WHERE id = ?',
        [result.insertId]
      );

      return res.status(201).json({
        success: true,
        message: 'About content created successfully.',
        about: newRows[0],
      });
    }

    const about = existingRows[0];

    await db.query(
      `
      UPDATE about
      SET
        eyebrow = ?,
        title = ?,
        description = ?,
        quote = ?
      WHERE id = ?
      `,
      [
        eyebrow || '',
        title || '',
        description || '',
        quote || '',
        about.id,
      ]
    );

    const [updatedRows] = await db.query(
      'SELECT * FROM about WHERE id = ?',
      [about.id]
    );

    return res.status(200).json({
      success: true,
      message: 'About content updated successfully.',
      about: updatedRows[0],
    });
  } catch (error) {
    console.error('UPDATE ABOUT ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update about content.',
      error: error.message,
    });
  }
}

export async function updateAboutWithImage(req, res) {
  try {
    const {
      eyebrow,
      title,
      description,
      quote,
    } = req.body;

    const [existingRows] = await db.query(
      'SELECT * FROM about ORDER BY id ASC LIMIT 1'
    );

    const imageOne = req.files?.image_one
      ? getUploadedFileUrl(req.files.image_one[0])
      : null;

    const imageTwo = req.files?.image_two
      ? getUploadedFileUrl(req.files.image_two[0])
      : null;

    if (existingRows.length === 0) {
      const [result] = await db.query(
        `
        INSERT INTO about (
          eyebrow,
          title,
          description,
          quote,
          image_one,
          image_two
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          eyebrow || '',
          title || '',
          description || '',
          quote || '',
          imageOne,
          imageTwo,
        ]
      );

      const [newRows] = await db.query(
        'SELECT * FROM about WHERE id = ?',
        [result.insertId]
      );

      return res.status(201).json({
        success: true,
        message: 'About content created successfully.',
        about: newRows[0],
      });
    }

    const about = existingRows[0];

    if (imageOne && about.image_one) {
      deleteFile(about.image_one);
    }

    if (imageTwo && about.image_two) {
      deleteFile(about.image_two);
    }

    const finalImageOne = imageOne || about.image_one;
    const finalImageTwo = imageTwo || about.image_two;

    await db.query(
      `
      UPDATE about
      SET
        eyebrow = ?,
        title = ?,
        description = ?,
        quote = ?,
        image_one = ?,
        image_two = ?
      WHERE id = ?
      `,
      [
        eyebrow || '',
        title || '',
        description || '',
        quote || '',
        finalImageOne,
        finalImageTwo,
        about.id,
      ]
    );

    const [updatedRows] = await db.query(
      'SELECT * FROM about WHERE id = ?',
      [about.id]
    );

    return res.status(200).json({
      success: true,
      message: 'About content and images updated successfully.',
      about: updatedRows[0],
    });
  } catch (error) {
    console.error('UPDATE ABOUT WITH IMAGE ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update about content with images.',
      error: error.message,
    });
  }
}