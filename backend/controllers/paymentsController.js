import db from '../config/db.js';

/**
 * POST /api/payments
 * Public route
 * Create payment record for an order
 */
export async function createPayment(req, res) {
  try {
    const { order_id, orderId, amount, method, status } = req.body;

    const finalOrderId = order_id || orderId;

    if (!finalOrderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required.',
      });
    }

    const [orders] = await db.query(
      'SELECT * FROM orders WHERE id = ?',
      [finalOrderId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    const paymentStatus = status || 'paid-demo';

    const [result] = await db.query(
      `
      INSERT INTO payments (
        order_id,
        amount,
        method,
        status
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        finalOrderId,
        amount || 0,
        method || 'Demo Payment',
        paymentStatus,
      ]
    );

    await db.query(
      'UPDATE orders SET payment_status = ? WHERE id = ?',
      [paymentStatus, finalOrderId]
    );

    const [newPaymentRows] = await db.query(
      'SELECT * FROM payments WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: 'Payment recorded successfully.',
      payment: newPaymentRows[0],
    });
  } catch (error) {
    console.error('CREATE PAYMENT ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to record payment.',
      error: error.message,
    });
  }
}

/**
 * GET /api/payments
 * Private/admin route
 * Get all payments
 */
export async function getPayments(req, res) {
  try {
    const [payments] = await db.query(
      `
      SELECT
        payments.*,
        orders.customer_name,
        orders.phone,
        orders.item
      FROM payments
      LEFT JOIN orders ON payments.order_id = orders.id
      ORDER BY payments.id DESC
      `
    );

    return res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error('GET PAYMENTS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load payments.',
      error: error.message,
    });
  }
}

/**
 * GET /api/payments/:id
 * Private/admin route
 * Get one payment
 */
export async function getPaymentById(req, res) {
  try {
    const { id } = req.params;

    const [payments] = await db.query(
      `
      SELECT
        payments.*,
        orders.customer_name,
        orders.phone,
        orders.item
      FROM payments
      LEFT JOIN orders ON payments.order_id = orders.id
      WHERE payments.id = ?
      `,
      [id]
    );

    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found.',
      });
    }

    return res.status(200).json({
      success: true,
      payment: payments[0],
    });
  } catch (error) {
    console.error('GET PAYMENT BY ID ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load payment.',
      error: error.message,
    });
  }
}

/**
 * DELETE /api/payments/:id
 * Private/admin route
 * Delete payment
 */
export async function deletePayment(req, res) {
  try {
    const { id } = req.params;

    const [existingRows] = await db.query(
      'SELECT * FROM payments WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found.',
      });
    }

    await db.query(
      'DELETE FROM payments WHERE id = ?',
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'Payment deleted successfully.',
    });
  } catch (error) {
    console.error('DELETE PAYMENT ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete payment.',
      error: error.message,
    });
  }
}