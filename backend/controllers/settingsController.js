import db from '../config/db.js';
import deleteFile from '../utils/deleteFile.js';

/**
 * GET /api/settings
 * Public route
 * Get website settings
 */
export async function getSettings(req, res) {
  try {
    const [rows] = await db.query(
      'SELECT * FROM settings ORDER BY id ASC LIMIT 1'
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Website settings not found.',
      });
    }

    return res.status(200).json({
      success: true,
      settings: rows[0],
    });
  } catch (error) {
    console.error('GET SETTINGS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load website settings.',
      error: error.message,
    });
  }
}

/**
 * PUT /api/settings
 * Private/Admin route
 * Update website settings (except logo)
 */
export async function updateSettings(req, res) {
  try {
    const {
      site_name,
      whatsapp_number,
      email,
      address,
      instagram,
      facebook,
      tiktok,
    } = req.body;

    const [existingRows] = await db.query(
      'SELECT * FROM settings ORDER BY id ASC LIMIT 1'
    );

    if (existingRows.length === 0) {
      const [result] = await db.query(
        `
        INSERT INTO settings (
          site_name,
          whatsapp_number,
          email,
          address,
          instagram,
          facebook,
          tiktok
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          site_name || '',
          whatsapp_number || '',
          email || '',
          address || '',
          instagram || '',
          facebook || '',
          tiktok || '',
        ]
      );

      const [newRows] = await db.query(
        'SELECT * FROM settings WHERE id = ?',
        [result.insertId]
      );

      return res.status(201).json({
        success: true,
        message: 'Settings created successfully.',
        settings: newRows[0],
      });
    }

    const settingsId = existingRows[0].id;

    await db.query(
      `
      UPDATE settings
      SET
        site_name = ?,
        whatsapp_number = ?,
        email = ?,
        address = ?,
        instagram = ?,
        facebook = ?,
        tiktok = ?
      WHERE id = ?
      `,
      [
        site_name || '',
        whatsapp_number || '',
        email || '',
        address || '',
        instagram || '',
        facebook || '',
        tiktok || '',
        settingsId,
      ]
    );

    const [updatedRows] = await db.query(
      'SELECT * FROM settings WHERE id = ?',
      [settingsId]
    );

    return res.status(200).json({
      success: true,
      message: 'Settings updated successfully.',
      settings: updatedRows[0],
    });
  } catch (error) {
    console.error('UPDATE SETTINGS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update website settings.',
      error: error.message,
    });
  }
}

/**
 * PUT /api/settings/logo
 * Private/Admin route
 * Upload or update website logo
 */
export async function updateSettingsLogo(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Logo image is required.',
      });
    }

    const newLogo = `/uploads/settings/${req.file.filename}`;

    const [existingRows] = await db.query(
      'SELECT * FROM settings ORDER BY id ASC LIMIT 1'
    );

    // Create settings row if it doesn't exist
    if (existingRows.length === 0) {
      const [result] = await db.query(
        `
        INSERT INTO settings (
          site_name,
          logo
        )
        VALUES (?, ?)
        `,
        ['Website', newLogo]
      );

      const [newRows] = await db.query(
        'SELECT * FROM settings WHERE id = ?',
        [result.insertId]
      );

      return res.status(201).json({
        success: true,
        message: 'Logo uploaded successfully.',
        settings: newRows[0],
      });
    }

    const settings = existingRows[0];

    // Delete previous uploaded logo
    if (
      settings.logo &&
      settings.logo.startsWith('/uploads/')
    ) {
      deleteFile(settings.logo);
    }

    await db.query(
      'UPDATE settings SET logo = ? WHERE id = ?',
      [newLogo, settings.id]
    );

    const [updatedRows] = await db.query(
      'SELECT * FROM settings WHERE id = ?',
      [settings.id]
    );

    return res.status(200).json({
      success: true,
      message: 'Logo updated successfully.',
      settings: updatedRows[0],
    });
  } catch (error) {
    console.error('UPDATE SETTINGS LOGO ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update logo.',
      error: error.message,
    });
  }
}