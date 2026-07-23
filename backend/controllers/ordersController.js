import db from '../config/db.js';

/**
 * POST /api/orders
 * Public route
 * Create a new customer order
 */
export async function createOrder(req, res) {
  try {
    const {
      customer_name,
      name,
      phone,
      email,
      item,
      amount,
      notes,
    } = req.body;

    const finalCustomerName = customer_name || name;

    const [result] = await db.query(
      `
      INSERT INTO orders (
        customer_name,
        phone,
        email,
        item,
        amount,
        notes,
        status,
        payment_status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        finalCustomerName,
        phone,
        email || '',
        item,
        amount || 0,
        notes || '',
        'pending',
        'unpaid',
      ]
    );

    const [newOrderRows] = await db.query(
      'SELECT * FROM orders WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      order: newOrderRows[0],
    });
  } catch (error) {
    console.error('CREATE ORDER ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to create order.',
      error: error.message,
    });
  }
}

/**
 * GET /api/orders
 * Private/admin route
 * Get all orders
 */
export async function getOrders(req, res) {
  try {
    const [orders] = await db.query(
      'SELECT * FROM orders ORDER BY id DESC'
    );

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('GET ORDERS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load orders.',
      error: error.message,
    });
  }
}

/**
 * GET /api/orders/search?keyword=value
 * Private/admin route
 * Search orders
 */
export async function searchOrders(req, res) {
  try {
    const keyword = req.query.keyword || '';

    const [orders] = await db.query(
      `
      SELECT * FROM orders
      WHERE
        customer_name LIKE ?
        OR phone LIKE ?
        OR email LIKE ?
        OR item LIKE ?
        OR status LIKE ?
        OR payment_status LIKE ?
      ORDER BY id DESC
      `,
      [
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
      ]
    );

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('SEARCH ORDERS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to search orders.',
      error: error.message,
    });
  }
}

/**
 * GET /api/orders/:id
 * Private/admin route
 * Get one order by ID
 */
export async function getOrderById(req, res) {
  try {
    const { id } = req.params;

    const [orders] = await db.query(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    return res.status(200).json({
      success: true,
      order: orders[0],
    });
  } catch (error) {
    console.error('GET ORDER BY ID ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load order.',
      error: error.message,
    });
  }
}

/**
 * PUT /api/orders/:id/status
 * Private/admin route
 * Update order status
 */
export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      'pending',
      'confirmed',
      'preparing',
      'ready',
      'delivered',
      'cancelled',
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status.',
      });
    }

    const [existingRows] = await db.query(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    await db.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    const [updatedRows] = await db.query(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully.',
      order: updatedRows[0],
    });
  } catch (error) {
    console.error('UPDATE ORDER STATUS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update order status.',
      error: error.message,
    });
  }
}

/**
 * PUT /api/orders/:id/payment-status
 * Private/admin route
 * Update order payment status
 */
export async function updateOrderPaymentStatus(req, res) {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    const allowedPaymentStatuses = [
      'unpaid',
      'paid',
      'paid-demo',
      'refunded',
    ];

    if (!allowedPaymentStatuses.includes(payment_status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status.',
      });
    }

    const [existingRows] = await db.query(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    await db.query(
      'UPDATE orders SET payment_status = ? WHERE id = ?',
      [payment_status, id]
    );

    const [updatedRows] = await db.query(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'Order payment status updated successfully.',
      order: updatedRows[0],
    });
  } catch (error) {
    console.error('UPDATE PAYMENT STATUS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update payment status.',
      error: error.message,
    });
  }
}

/**
 * DELETE /api/orders/:id
 * Private/admin route
 * Delete order
 */
export async function deleteOrder(req, res) {
  try {
    const { id } = req.params;

    const [existingRows] = await db.query(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    await db.query(
      'DELETE FROM orders WHERE id = ?',
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'Order deleted successfully.',
    });
  } catch (error) {
    console.error('DELETE ORDER ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete order.',
      error: error.message,
    });
  }
}