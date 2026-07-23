import db from '../config/db.js';

export async function getDashboardStats(req, res) {
  try {
    const [[boxesResult]] = await db.query(
      'SELECT COUNT(*) AS total FROM boxes'
    );

    const [[eventsResult]] = await db.query(
      'SELECT COUNT(*) AS total FROM events'
    );

    const [[galleryResult]] = await db.query(
      'SELECT COUNT(*) AS total FROM gallery'
    );

    const [[messagesResult]] = await db.query(
      'SELECT COUNT(*) AS total FROM contact_messages'
    );

    const [[usersResult]] = await db.query(
      'SELECT COUNT(*) AS total FROM users'
    );

    const [[ordersResult]] = await db.query(
      'SELECT COUNT(*) AS total FROM orders'
    );

    const [[paymentsResult]] = await db.query(
      'SELECT COUNT(*) AS total FROM payments'
    );

    const [[newslettersResult]] = await db.query(
      'SELECT COUNT(*) AS total FROM newsletters'
    );

    const [[revenueResult]] = await db.query(
      `
      SELECT COALESCE(SUM(amount), 0) AS total
      FROM payments
      WHERE status IN ('paid', 'paid-demo')
      `
    );

    const [[unreadMessagesResult]] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM contact_messages
      WHERE is_read = FALSE
      `
    );

    return res.status(200).json({
      success: true,
      boxes: boxesResult.total,
      events: eventsResult.total,
      gallery: galleryResult.total,
      messages: messagesResult.total,
      users: usersResult.total,
      orders: ordersResult.total,
      payments: paymentsResult.total,
      newsletters: newslettersResult.total,
      totalRevenue: Number(revenueResult.total || 0),
      unreadMessages: unreadMessagesResult.total,
    });
  } catch (error) {
    console.error('DASHBOARD STATS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load dashboard statistics.',
      error: error.message,
    });
  }
}