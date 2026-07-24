import db from '../config/db.js';
import deleteFile from '../utils/deleteFile.js';
import getUploadedFileUrl from '../utils/getUploadedFileUrl.js';

export async function getGallery(req, res) {
  try {
    const [gallery] = await db.query(
      'SELECT * FROM gallery ORDER BY id DESC'
    );

    return res.status(200).json({
      success: true,
      gallery,
    });
  } catch (error) {
    console.error('GET GALLERY ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load gallery images.',
      error: error.message,
    });
  }
}

export async function uploadGalleryImage(req, res) {
  try {
    const { title, category } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image is required.',
      });
    }

    const image = getUploadedFileUrl(req.file);

    const [result] = await db.query(
      `
      INSERT INTO gallery (
        title,
        category,
        image
      )
      VALUES (?, ?, ?)
      `,
      [
        title,
        category || '',
        image,
      ]
    );

    const [newGalleryRows] = await db.query(
      'SELECT * FROM gallery WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: 'Gallery image uploaded successfully.',
      galleryItem: newGalleryRows[0],
    });
  } catch (error) {
    console.error('UPLOAD GALLERY IMAGE ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to upload gallery image.',
      error: error.message,
    });
  }
}

export async function updateGalleryImage(req, res) {
  try {
    const { id } = req.params;
    const { title, category } = req.body;

    const [existingRows] = await db.query(
      'SELECT * FROM gallery WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found.',
      });
    }

    const existingImage = existingRows[0];

    const newImage = req.file
      ? getUploadedFileUrl(req.file)
      : null;

    if (newImage && existingImage.image) {
      deleteFile(existingImage.image);
    }

    const finalImage = newImage || existingImage.image;

    await db.query(
      `
      UPDATE gallery
      SET
        title = ?,
        category = ?,
        image = ?
      WHERE id = ?
      `,
      [
        title || existingImage.title,
        category || existingImage.category || '',
        finalImage,
        id,
      ]
    );

    const [updatedRows] = await db.query(
      'SELECT * FROM gallery WHERE id = ?',
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'Gallery image updated successfully.',
      galleryItem: updatedRows[0],
    });
  } catch (error) {
    console.error('UPDATE GALLERY IMAGE ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update gallery image.',
      error: error.message,
    });
  }
}

export async function deleteGalleryImage(req, res) {
  try {
    const { id } = req.params;

    const [existingRows] = await db.query(
      'SELECT * FROM gallery WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found.',
      });
    }

    const galleryItem = existingRows[0];

    if (galleryItem.image) {
      deleteFile(galleryItem.image);
    }

    await db.query(
      'DELETE FROM gallery WHERE id = ?',
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'Gallery image deleted successfully.',
    });
  } catch (error) {
    console.error('DELETE GALLERY IMAGE ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete gallery image.',
      error: error.message,
    });
  }
}