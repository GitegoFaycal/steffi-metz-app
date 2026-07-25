import db from '../config/db.js';

export async function createCommunityApplication(req, res) {
  try {
    const {
      full_name,
      phone,
      email,
      product_idea,
      brings_own_product,
      willing_to_pay_product_cost,
      preferred_date,
      message,
      agreed_to_terms,
    } = req.body;

    if (!full_name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Full name and phone number are required.',
      });
    }

    if (!agreed_to_terms) {
      return res.status(400).json({
        success: false,
        message: 'You must agree to the application conditions.',
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO community_applications (
        full_name,
        phone,
        email,
        product_idea,
        brings_own_product,
        willing_to_pay_product_cost,
        preferred_date,
        message,
        agreed_to_terms,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        full_name,
        phone,
        email || '',
        product_idea || '',
        brings_own_product || 'yes',
        willing_to_pay_product_cost || 'no',
        preferred_date || null,
        message || '',
        agreed_to_terms ? 1 : 0,
        'pending',
      ]
    );

    const [newRows] = await db.query(
      'SELECT * FROM community_applications WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully. We will review it and contact selected applicants.',
      application: newRows[0],
    });
  } catch (error) {
    console.error('CREATE COMMUNITY APPLICATION ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to submit application.',
      error: error.message,
    });
  }
}

export async function getCommunityApplications(req, res) {
  try {
    const [applications] = await db.query(
      'SELECT * FROM community_applications ORDER BY id DESC'
    );

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error('GET COMMUNITY APPLICATIONS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load community applications.',
      error: error.message,
    });
  }
}

export async function getCommunityApplicationById(req, res) {
  try {
    const { id } = req.params;

    const [applications] = await db.query(
      'SELECT * FROM community_applications WHERE id = ?',
      [id]
    );

    if (applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    return res.status(200).json({
      success: true,
      application: applications[0],
    });
  } catch (error) {
    console.error('GET COMMUNITY APPLICATION ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load application.',
      error: error.message,
    });
  }
}

export async function updateCommunityApplicationStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    const allowedStatuses = ['pending', 'approved', 'rejected'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status.',
      });
    }

    const [existingRows] = await db.query(
      'SELECT * FROM community_applications WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    await db.query(
      `
      UPDATE community_applications
      SET
        status = ?,
        admin_notes = ?
      WHERE id = ?
      `,
      [
        status,
        admin_notes || '',
        id,
      ]
    );

    const [updatedRows] = await db.query(
      'SELECT * FROM community_applications WHERE id = ?',
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'Application updated successfully.',
      application: updatedRows[0],
    });
  } catch (error) {
    console.error('UPDATE COMMUNITY APPLICATION ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update application.',
      error: error.message,
    });
  }
}

export async function deleteCommunityApplication(req, res) {
  try {
    const { id } = req.params;

    const [existingRows] = await db.query(
      'SELECT * FROM community_applications WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    await db.query(
      'DELETE FROM community_applications WHERE id = ?',
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'Application deleted successfully.',
    });
  } catch (error) {
    console.error('DELETE COMMUNITY APPLICATION ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete application.',
      error: error.message,
    });
  }
}