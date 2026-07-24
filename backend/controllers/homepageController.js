import db from '../config/db.js';
import deleteFile from '../utils/deleteFile.js';
import getUploadedFileUrl from '../utils/getUploadedFileUrl.js';
import addImageToGallery from '../utils/addImageToGallery.js';

export async function getHomepage(req, res) {
  try {
    const [rows] = await db.query(
      'SELECT * FROM homepage ORDER BY id ASC LIMIT 1'
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Homepage content not found.',
      });
    }

    return res.status(200).json({
      success: true,
      homepage: rows[0],
    });
  } catch (error) {
    console.error('GET HOMEPAGE ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load homepage content.',
      error: error.message,
    });
  }
}

export async function updateHomepage(req, res) {
  try {
    const {
      location_text,
      hero_title,
      hero_highlight,
      hero_description,
      button_one_text,
      button_two_text,
    } = req.body;

    const [existingRows] = await db.query(
      'SELECT * FROM homepage ORDER BY id ASC LIMIT 1'
    );

    if (existingRows.length === 0) {
      const [result] = await db.query(
        `
        INSERT INTO homepage (
          location_text,
          hero_title,
          hero_highlight,
          hero_description,
          button_one_text,
          button_two_text
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          location_text || '',
          hero_title || '',
          hero_highlight || '',
          hero_description || '',
          button_one_text || '',
          button_two_text || '',
        ]
      );

      const [newRows] = await db.query(
        'SELECT * FROM homepage WHERE id = ?',
        [result.insertId]
      );

      return res.status(201).json({
        success: true,
        message: 'Homepage content created successfully.',
        homepage: newRows[0],
      });
    }

    const homepage = existingRows[0];

    await db.query(
      `
      UPDATE homepage
      SET
        location_text = ?,
        hero_title = ?,
        hero_highlight = ?,
        hero_description = ?,
        button_one_text = ?,
        button_two_text = ?
      WHERE id = ?
      `,
      [
        location_text || '',
        hero_title || '',
        hero_highlight || '',
        hero_description || '',
        button_one_text || '',
        button_two_text || '',
        homepage.id,
      ]
    );

    const [updatedRows] = await db.query(
      'SELECT * FROM homepage WHERE id = ?',
      [homepage.id]
    );

    return res.status(200).json({
      success: true,
      message: 'Homepage content updated successfully.',
      homepage: updatedRows[0],
    });
  } catch (error) {
    console.error('UPDATE HOMEPAGE ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update homepage content.',
      error: error.message,
    });
  }
}

export async function updateHomepageWithImage(req, res) {
  try {
    const {
      location_text,
      hero_title,
      hero_highlight,
      hero_description,
      button_one_text,
      button_two_text,
    } = req.body;

    const [existingRows] = await db.query(
      'SELECT * FROM homepage ORDER BY id ASC LIMIT 1'
    );

    const heroImage = req.file
      ? getUploadedFileUrl(req.file)
      : null;

    if (heroImage) {
      await addImageToGallery({
        title: 'Homepage Hero Image',
        category: 'homepage',
        image: heroImage,
      });
    }

    if (existingRows.length === 0) {
      const [result] = await db.query(
        `
        INSERT INTO homepage (
          location_text,
          hero_title,
          hero_highlight,
          hero_description,
          button_one_text,
          button_two_text,
          hero_image
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          location_text || '',
          hero_title || '',
          hero_highlight || '',
          hero_description || '',
          button_one_text || '',
          button_two_text || '',
          heroImage,
        ]
      );

      const [newRows] = await db.query(
        'SELECT * FROM homepage WHERE id = ?',
        [result.insertId]
      );

      return res.status(201).json({
        success: true,
        message: 'Homepage content created successfully.',
        homepage: newRows[0],
      });
    }

    const homepage = existingRows[0];

    if (heroImage && homepage.hero_image) {
      deleteFile(homepage.hero_image);
    }

    const finalHeroImage = heroImage || homepage.hero_image;

    await db.query(
      `
      UPDATE homepage
      SET
        location_text = ?,
        hero_title = ?,
        hero_highlight = ?,
        hero_description = ?,
        button_one_text = ?,
        button_two_text = ?,
        hero_image = ?
      WHERE id = ?
      `,
      [
        location_text || '',
        hero_title || '',
        hero_highlight || '',
        hero_description || '',
        button_one_text || '',
        button_two_text || '',
        finalHeroImage,
        homepage.id,
      ]
    );

    const [updatedRows] = await db.query(
      'SELECT * FROM homepage WHERE id = ?',
      [homepage.id]
    );

    return res.status(200).json({
      success: true,
      message: 'Homepage content and hero image updated successfully.',
      homepage: updatedRows[0],
    });
  } catch (error) {
    console.error('UPDATE HOMEPAGE WITH IMAGE ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update homepage content with image.',
      error: error.message,
    });
  }
}