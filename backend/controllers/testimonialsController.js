import db from '../config/db.js';

/**
 * GET /api/testimonials
 * Public route
 * Get all active testimonials
 */
export async function getTestimonials(req, res) {
  try {
    const [testimonials] = await db.query(
      'SELECT * FROM testimonials WHERE status = "active" ORDER BY id DESC'
    );

    return res.status(200).json({
      success: true,
      testimonials,
    });

  } catch (error) {
    console.error('GET TESTIMONIALS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load testimonials.',
      error: error.message,
    });
  }
}


/**
 * GET /api/testimonials/search?keyword=value
 * Public route
 * Search testimonials
 */
export async function searchTestimonials(req, res) {
  try {
    const keyword = req.query.keyword || '';

    const [testimonials] = await db.query(
      `
      SELECT * FROM testimonials
      WHERE
        customer_name LIKE ?
        OR customer_title LIKE ?
        OR message LIKE ?
      ORDER BY id DESC
      `,
      [
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
      ]
    );

    return res.status(200).json({
      success: true,
      testimonials,
    });

  } catch (error) {
    console.error('SEARCH TESTIMONIALS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to search testimonials.',
      error: error.message,
    });
  }
}


/**
 * GET /api/testimonials/:id
 * Public route
 * Get one testimonial by ID
 */
export async function getTestimonialById(req, res) {
  try {
    const { id } = req.params;

    const [testimonials] = await db.query(
      'SELECT * FROM testimonials WHERE id = ?',
      [id]
    );


    if (testimonials.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found.',
      });
    }


    return res.status(200).json({
      success: true,
      testimonial: testimonials[0],
    });


  } catch (error) {

    console.error('GET TESTIMONIAL BY ID ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load testimonial.',
      error: error.message,
    });
  }
}


/**
 * POST /api/testimonials
 * Private/admin route
 * Create new testimonial
 */
export async function createTestimonial(req, res) {

  try {

    const {
      customer_name,
      customer_title,
      rating,
      message,
      status,
    } = req.body;


    const [result] = await db.query(
      `
      INSERT INTO testimonials (
        customer_name,
        customer_title,
        rating,
        message,
        status
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        customer_name,
        customer_title || '',
        rating || 5,
        message,
        status || 'active',
      ]
    );


    const [newRows] = await db.query(
      'SELECT * FROM testimonials WHERE id = ?',
      [result.insertId]
    );


    return res.status(201).json({
      success: true,
      message: 'Testimonial created successfully.',
      testimonial: newRows[0],
    });


  } catch (error) {

    console.error('CREATE TESTIMONIAL ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to create testimonial.',
      error: error.message,
    });

  }
}


/**
 * PUT /api/testimonials/:id
 * Private/admin route
 * Update testimonial
 */
export async function updateTestimonial(req, res) {

  try {

    const { id } = req.params;


    const {
      customer_name,
      customer_title,
      rating,
      message,
      status,
    } = req.body;


    const [existingRows] = await db.query(
      'SELECT * FROM testimonials WHERE id = ?',
      [id]
    );


    if (existingRows.length === 0) {

      return res.status(404).json({
        success: false,
        message: 'Testimonial not found.',
      });

    }


    const existingTestimonial = existingRows[0];


    await db.query(
      `
      UPDATE testimonials
      SET
        customer_name = ?,
        customer_title = ?,
        rating = ?,
        message = ?,
        status = ?
      WHERE id = ?
      `,
      [
        customer_name,
        customer_title || '',
        rating || existingTestimonial.rating || 5,
        message,
        status || existingTestimonial.status || 'active',
        id,
      ]
    );


    const [updatedRows] = await db.query(
      'SELECT * FROM testimonials WHERE id = ?',
      [id]
    );


    return res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully.',
      testimonial: updatedRows[0],
    });


  } catch (error) {

    console.error('UPDATE TESTIMONIAL ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update testimonial.',
      error: error.message,
    });

  }
}


/**
 * DELETE /api/testimonials/:id
 * Private/admin route
 * Delete testimonial
 */
export async function deleteTestimonial(req, res) {

  try {

    const { id } = req.params;


    const [existingRows] = await db.query(
      'SELECT * FROM testimonials WHERE id = ?',
      [id]
    );


    if (existingRows.length === 0) {

      return res.status(404).json({
        success: false,
        message: 'Testimonial not found.',
      });

    }


    await db.query(
      'DELETE FROM testimonials WHERE id = ?',
      [id]
    );


    return res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully.',
    });


  } catch (error) {

    console.error('DELETE TESTIMONIAL ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete testimonial.',
      error: error.message,
    });

  }
}