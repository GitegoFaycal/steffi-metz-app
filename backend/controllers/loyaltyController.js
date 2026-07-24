import db from '../config/db.js';

/**
 * GET /api/loyalty
 * Public route
 * Get all active loyalty tiers
 */
export async function getLoyaltyTiers(req, res) {
  try {
    const[tiers] = await db.query(
      'SELECT * FROM loyalty_tiers WHERE status = "active" ORDER BY sort_order ASC, id ASC'
    );

    return res.status(200).json({
      success: true,
      tiers,
    });
  } catch (error) {
    console.error('GET*LOYALTY TIERS ERROR:', error);

   return res.status(500).json({
     success: false,
      message: 'failed to load loyalty tiers.',
    error: error.message,
    });
    }
}

/**
 * GET /api/loyalty/admin
** Private/admin route
 * Get all l*yalty tiers, active and inactive
 */
export async function getAllLoyaltyTiers(req, res) {
  try {
    const [tiers] = await db.query(
      'SELECT * FROM loyalty_tiers ORDER BY sort_order ASC, id ASC'
    );

    return res.status(200).json({
      success: true,
      tiers,
    });
  } catch (error) {
    console.error('GET ALL LOYALTY TIERS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load loyalty tiers.',
      error: error.message,
    });
  }
}

/**
 * GET /*pi/loyalty/:id
 * Public route
 * *et one loyalty tier by ID
 */
export async function getLoyaltyTierById(req, res) {
  try {
    const { id } = req.params;

    const [tiers] = await db.query(
      'SELECT *FROM loyalty_tiers WHERE id = ?',
     [id]
    );

    if (tiers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Loyalty tier not found.',
      });
    }

    return res.status(200).json({
      success: true,
      tier: tiers[0]
    });
  } catch (error) {
    console.error('GET LOYALTY TIER BY ID ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load loyalty tier.',
      error: error.message,
    });
  }
}

/**
 * POST /api/loyalty
 * Private/admin route
 * Create new loyalty tier
 */
export async function createLoyaltyTier(req, res) {
  try {
    const {
      icon,
      name,
      monthly_spend,
      discount,
      benefits,
      sort_order,
      status,
    } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO loyalty_tiers (
        icon,
        name,
        monthly_spend,
        discount,
        benefits,
        sort_order,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        icon || '',
        name,
        monthly_spend || '',
        discount || '',
        benefits || '',
        sort_order || 0,
        status || 'active',
      ]
    );

    const [newRows] = await db.query(
      'SELECT * FROM loyalty_tiers WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: 'Loyalty tier created successfully.',
      tier: newRows[0],
    });
  } catch (error) {
    console.error('CREATE LOYALTY TIER ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to create loyalty tier.',
      error: error.message,
    });
  }
}

/**
 * PUT /api/loyalty/:id
 * Private/admin route
 * Update loyalty tier
 */
export async function updateLoyaltyTier(req, res) {
  try {
    const { id } = req.params;

    const {
      icon,
      name,
      monthly_spend,
      discount,
      benefits,
      sort_order,
      status,
    } = req.body;

    const [existingRows] = await db.query(
      'SELECT * FROM loyalty_tiers WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Loyalty tier not found.',
      });
    }

    const existingTier = existingRows[0];

    await db.query(
      `
      UPDATE loyalty_tiers
      SET
        icon = ?,
        name = ?,
        monthly_spend = ?,
        discount = ?,
        benefits = ?,
        sort_order = ?,
        status = ?
      WHERE id = ?
      `,
      [
        icon || existingTier.icon || '',
        name,
        monthly_spend || '',
        discount || '',
        benefits || '',
        sort_order ?? existingTier.sort_order ?? 0,
        status || existingTier.status || 'active',
        id,
      ]
    );

    const [updatedRows] = await db.query(
      'SELECT * FROM loyalty_tiers WHERE id = ?',
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'Loyalty tier updated successfully.',
      tier: updatedRows[0],
    });
  } catch (error) {
    console.error('UPDATE LOYALTY TIER ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update loyalty tier.',
      error: error.message,
    });
  }
}

/**
 * DELETE /api/loyalty/:id
 * Private/admin route
 * Delete loyalty tier
 */
export async function deleteLoyaltyTier(req, res) {
  try {
    const { id } = req.params;

    const [existingRows] = await db.query(
      'SELECT * FROM loyalty_tiers WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Loyalty tier not found.',
      });
    }

    await db.query(
      'DELETE FROM loyalty_tiers WHERE id = ?',
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'Loyalty tier deleted successfully.',
    });
  } catch (error) {
    console.error('DELETE LOYALTY TIER ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete loyalty tier.',
      error: error.message,
    });
  }
}