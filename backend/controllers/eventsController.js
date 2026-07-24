import db from '../config/db.js';
import deleteFile from '../utils/deleteFile.js';
import getUploadedFileUrl from '../utils/getUploadedFileUrl.js';

export async function getEvents(req, res) {
  try {
    const [events] = await db.query(
      'SELECT * FROM events WHERE status = "active" ORDER BY id DESC'
    );

    return res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error('GET EVENTS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load events.',
      error: error.message,
    });
  }
}

export async function searchEvents(req, res) {
  try {
    const keyword = req.query.keyword || '';

    const [events] = await db.query(
      `
      SELECT * FROM events
      WHERE
        title LIKE ?
        OR price LIKE ?
        OR badge LIKE ?
        OR description LIKE ?
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
      events,
    });
  } catch (error) {
    console.error('SEARCH EVENTS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to search events.',
      error: error.message,
    });
  }
}

export async function getEventById(req, res) {
  try {
    const { id } = req.params;

    const [events] = await db.query(
      'SELECT * FROM events WHERE id = ?',
      [id]
    );

    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    return res.status(200).json({
      success: true,
      event: events[0],
    });
  } catch (error) {
    console.error('GET EVENT BY ID ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load event.',
      error: error.message,
    });
  }
}

export async function createEvent(req, res) {
  try {
    const {
      title,
      price,
      badge,
      description,
      status,
    } = req.body;

    const image = req.file
      ? getUploadedFileUrl(req.file)
      : null;

    const [result] = await db.query(
      `
      INSERT INTO events (
        title,
        price,
        badge,
        description,
        image,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        title,
        price || '',
        badge || '',
        description || '',
        image,
        status || 'active',
      ]
    );

    const [newEventRows] = await db.query(
      'SELECT * FROM events WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: 'Event created successfully.',
      event: newEventRows[0],
    });
  } catch (error) {
    console.error('CREATE EVENT ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to create event.',
      error: error.message,
    });
  }
}

export async function updateEvent(req, res) {
  try {
    const { id } = req.params;

    const {
      title,
      price,
      badge,
      description,
      status,
    } = req.body;

    const [existingRows] = await db.query(
      'SELECT * FROM events WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    const existingEvent = existingRows[0];

    const newImage = req.file
      ? getUploadedFileUrl(req.file)
      : null;

    if (newImage && existingEvent.image) {
      deleteFile(existingEvent.image);
    }

    const finalImage = newImage || existingEvent.image;

    await db.query(
      `
      UPDATE events
      SET
        title = ?,
        price = ?,
        badge = ?,
        description = ?,
        image = ?,
        status = ?
      WHERE id = ?
      `,
      [
        title || existingEvent.title,
        price || existingEvent.price || '',
        badge || existingEvent.badge || '',
        description || existingEvent.description || '',
        finalImage,
        status || existingEvent.status || 'active',
        id,
      ]
    );

    const [updatedRows] = await db.query(
      'SELECT * FROM events WHERE id = ?',
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully.',
      event: updatedRows[0],
    });
  } catch (error) {
    console.error('UPDATE EVENT ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update event.',
      error: error.message,
    });
  }
}

export async function deleteEvent(req, res) {
  try {
    const { id } = req.params;

    const [existingRows] = await db.query(
      'SELECT * FROM events WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    const event = existingRows[0];

    if (event.image) {
      deleteFile(event.image);
    }

    await db.query(
      'DELETE FROM events WHERE id = ?',
      [id]
    );
    return res.status(200).json({
      success: true,
      message: 'Event deleted successfully.',
    });
  } catch (error) {
    console.error('DELETE EVENT ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete event.',
      error: error.message,
    });
  }
}