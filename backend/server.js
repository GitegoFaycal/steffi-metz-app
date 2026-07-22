import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import crypto from 'crypto';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const SECRET = process.env.JWT_SECRET || 'dev-secret-change-this';
const siteData = JSON.parse(fs.readFileSync('./data/siteData.json', 'utf8'));
const dbPath = './data/database.json';

app.use(cors());
app.use(express.json());

function readDb() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}
function writeDb(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}
function signToken(user) {
  const payload = Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: user.role, name: user.name })).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}
function verifyToken(token) {
  if (!token || !token.includes('.')) return null;
  const [payload, signature] = token.split('.');
  const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  if (signature !== expected) return null;
  return JSON.parse(Buffer.from(payload, 'base64url').toString());
}
function requireAuth(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  const user = verifyToken(token);
  if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });
  req.user = user;
  next();
}
function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin only' });
  next();
}

app.get('/api', (req, res) => res.json(siteData));
app.get('/api/boxes', (req, res) => res.json(readDb().boxes || siteData.boxes));
app.get('/api/events', (req, res) => res.json(readDb().events || siteData.events));
app.get('/api/loyalty', (req, res) => res.json(siteData.loyalty));

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDb();
  const user = db.users.find(u => u.email.toLowerCase() === String(email || '').toLowerCase());
  if (!user || user.passwordHash !== hashPassword(password || '')) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
  const { passwordHash, ...safeUser } = user;
  res.json({ success: true, token: signToken(user), user: safeUser });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ success: true, user: req.user });
});

app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
  const db = readDb();
  const exists = db.newsletters.some(n => n.email.toLowerCase() === email.toLowerCase());
  if (!exists) db.newsletters.push({ id: Date.now(), email, createdAt: new Date().toISOString() });
  db.emails.push({ id: Date.now() + 1, to: email, subject: 'Welcome to Steffi Metz', body: 'Thank you for subscribing.', status: 'sent-demo', createdAt: new Date().toISOString() });
  writeDb(db);
  res.json({ success: true, message: 'Subscribed and welcome email recorded' });
});

app.post('/api/order', (req, res) => {
  const { name, phone, email, item, amount, notes } = req.body;
  if (!name || !phone || !item) return res.status(400).json({ success: false, message: 'Name, phone, and item are required' });
  const db = readDb();
  const order = {
    id: Date.now(),
    name,
    phone,
    email: email || '',
    item,
    amount: Number(amount || 0),
    notes: notes || '',
    status: 'pending',
    paymentStatus: 'unpaid',
    createdAt: new Date().toISOString()
  };
  db.orders.unshift(order);
  db.emails.push({ id: Date.now() + 1, to: email || 'admin@steffi.com', subject: 'Order received', body: `Order received for ${item}`, status: 'sent-demo', createdAt: new Date().toISOString() });
  writeDb(db);
  res.status(201).json({ success: true, order });
});

app.post('/api/payment/create', (req, res) => {
  const { orderId, amount, method } = req.body;
  if (!orderId || !amount || !method) return res.status(400).json({ success: false, message: 'orderId, amount, and method are required' });
  const db = readDb();
  const payment = { id: Date.now(), orderId: Number(orderId), amount: Number(amount), method, status: 'paid-demo', createdAt: new Date().toISOString() };
  db.payments.unshift(payment);
  const order = db.orders.find(o => o.id === Number(orderId));
  if (order) order.paymentStatus = 'paid-demo';
  writeDb(db);
  res.status(201).json({ success: true, message: 'Demo payment recorded', payment });
});

app.post('/api/email/send', requireAuth, requireAdmin, (req, res) => {
  const { to, subject, body } = req.body;
  if (!to || !subject || !body) return res.status(400).json({ success: false, message: 'to, subject, and body are required' });
  const db = readDb();
  const email = { id: Date.now(), to, subject, body, status: 'sent-demo', createdAt: new Date().toISOString() };
  db.emails.unshift(email);
  writeDb(db);
  res.json({ success: true, email });
});

app.get('/api/admin/summary', requireAuth, requireAdmin, (req, res) => {
  const db = readDb();
  const totalRevenue = db.payments.filter(p => p.status.includes('paid')).reduce((sum, p) => sum + Number(p.amount || 0), 0);
  res.json({
    success: true,
    summary: {
      users: db.users.length,
      orders: db.orders.length,
      payments: db.payments.length,
      newsletters: db.newsletters.length,
      emails: db.emails.length,
      totalRevenue
    }
  });
});

app.get('/api/admin/orders', requireAuth, requireAdmin, (req, res) => {
  res.json({ success: true, orders: readDb().orders });
});

app.patch('/api/admin/orders/:id/status', requireAuth, requireAdmin, (req, res) => {
  const db = readDb();
  const order = db.orders.find(o => o.id === Number(req.params.id));
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  order.status = req.body.status || order.status;
  writeDb(db);
  res.json({ success: true, order });
});

app.get('/api/admin/newsletters', requireAuth, requireAdmin, (req, res) => {
  res.json({ success: true, newsletters: readDb().newsletters });
});


// Admin product/box management: add, update, delete items shown on the site
app.get('/api/admin/boxes', requireAuth, requireAdmin, (req, res) => {
  res.json({ success: true, boxes: readDb().boxes || [] });
});

app.post('/api/admin/boxes', requireAuth, requireAdmin, (req, res) => {
  const { name, price, serves, items, image } = req.body;
  if (!name || !price) return res.status(400).json({ success: false, message: 'Name and price are required' });
  const db = readDb();
  const nextId = db.boxes?.length ? Math.max(...db.boxes.map(b => Number(b.id))) + 1 : 1;
  const box = {
    id: nextId,
    name,
    price: String(price).replace(' RWF',''),
    serves: serves || '1',
    items: Array.isArray(items) ? items : String(items || '').split(',').map(i => i.trim()).filter(Boolean),
    image: image || ''
  };
  db.boxes = db.boxes || [];
  db.boxes.push(box);
  writeDb(db);
  res.status(201).json({ success: true, box });
});

app.patch('/api/admin/boxes/:id', requireAuth, requireAdmin, (req, res) => {
  const db = readDb();
  const box = (db.boxes || []).find(b => Number(b.id) === Number(req.params.id));
  if (!box) return res.status(404).json({ success: false, message: 'Box not found' });
  const { name, price, serves, items, image } = req.body;
  if (name !== undefined) box.name = name;
  if (price !== undefined) box.price = String(price).replace(' RWF','');
  if (serves !== undefined) box.serves = serves;
  if (items !== undefined) box.items = Array.isArray(items) ? items : String(items).split(',').map(i => i.trim()).filter(Boolean);
  if (image !== undefined) box.image = image;
  writeDb(db);
  res.json({ success: true, box });
});

app.delete('/api/admin/boxes/:id', requireAuth, requireAdmin, (req, res) => {
  const db = readDb();
  const before = (db.boxes || []).length;
  db.boxes = (db.boxes || []).filter(b => Number(b.id) !== Number(req.params.id));
  if (db.boxes.length === before) return res.status(404).json({ success: false, message: 'Box not found' });
  writeDb(db);
  res.json({ success: true, message: 'Box deleted' });
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
