CREATE DATABASE IF NOT EXISTS steffi_metz_db;
USE steffi_metz_db;

-- =========================
-- USERS
-- =========================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'editor') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- HOMEPAGE
-- =========================
CREATE TABLE IF NOT EXISTS homepage (
  id INT AUTO_INCREMENT PRIMARY KEY,
  location_text VARCHAR(255),
  hero_title VARCHAR(255),
  hero_highlight VARCHAR(255),
  hero_description TEXT,
  button_one_text VARCHAR(100),
  button_two_text VARCHAR(100),
  hero_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- ABOUT
-- =========================
CREATE TABLE IF NOT EXISTS about (
  id INT AUTO_INCREMENT PRIMARY KEY,
  eyebrow VARCHAR(100),
  title VARCHAR(255),
  description TEXT,
  quote TEXT,
  image_one VARCHAR(255),
  image_two VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- BOXES / SERVICES
-- =========================
CREATE TABLE IF NOT EXISTS boxes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  price VARCHAR(50) NOT NULL,
  serves VARCHAR(50),
  items TEXT,
  image VARCHAR(255),
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- EVENTS
-- =========================
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  price VARCHAR(100),
  badge VARCHAR(100),
  description TEXT,
  image VARCHAR(255),
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- GALLERY
-- =========================
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  category VARCHAR(100),
  image VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- TESTIMONIALS
-- =========================
CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(150) NOT NULL,
  customer_title VARCHAR(150),
  rating INT DEFAULT 5,
  message TEXT NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- CONTACT MESSAGES
-- =========================
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- ORDERS
-- =========================
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(150),
  item VARCHAR(150) NOT NULL,
  amount DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  status ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled') DEFAULT 'pending',
  payment_status ENUM('unpaid', 'paid', 'paid-demo', 'refunded') DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- PAYMENTS
-- =========================
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  amount DECIMAL(10,2) DEFAULT 0,
  method VARCHAR(100),
  status ENUM('pending', 'paid', 'paid-demo', 'failed', 'refunded') DEFAULT 'paid-demo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- =========================
-- NEWSLETTERS
-- =========================
CREATE TABLE IF NOT EXISTS newsletters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- SETTINGS
-- =========================
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  site_name VARCHAR(150),
  logo VARCHAR(255),
  whatsapp_number VARCHAR(50),
  email VARCHAR(150),
  address VARCHAR(255),
  instagram VARCHAR(255),
  facebook VARCHAR(255),
  tiktok VARCHAR(255),

  catalogue_title VARCHAR(255),
  catalogue_description TEXT,

  newsletter_title VARCHAR(255),
  newsletter_description TEXT,

  shop_title VARCHAR(255),
  opening_hours TEXT,
  shop_image VARCHAR(255),

  footer_description TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- LOYALTY TIERS
-- =========================
CREATE TABLE IF NOT EXISTS loyalty_tiers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(20),
  name VARCHAR(100) NOT NULL,
  monthly_spend VARCHAR(100),
  discount VARCHAR(20),
  benefits TEXT,
  sort_order INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- MARQUEE ITEMS
-- =========================
CREATE TABLE IF NOT EXISTS marquee_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  text VARCHAR(255) NOT NULL,
  sort_order INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- DEFAULT HOMEPAGE DATA
-- =========================
INSERT INTO homepage (
  location_text,
  hero_title,
  hero_highlight,
  hero_description,
  button_one_text,
  button_two_text,
  hero_image
)
SELECT
  'Kigali, Rwanda · Since 2020',
  'Handcrafted with love',
  'made for real food lovers',
  'Artisan breads, handmade cheeses, fermented kombucha, gourmet boxes, cooking classes, events and catering. All made fresh in Kigali.',
  'Explore boxes',
  'My loyalty savings',
  '/assets/image-3.jpg'
WHERE NOT EXISTS (SELECT 1 FROM homepage);

-- =========================
-- DEFAULT ABOUT DATA
-- =========================
INSERT INTO about (
  eyebrow,
  title,
  description,
  quote,
  image_one,
  image_two
)
SELECT
  'About Steffi',
  'European chef,<br/><em>Kigali heart</em>',
  'The Gourmet Shop brings European craft, fresh local ingredients and warm community experiences together in Kigali.',
  'Food should feel generous, beautiful and real — handmade with love.',
  '/assets/image-4.jpg',
  '/assets/image-5.jpg'
WHERE NOT EXISTS (SELECT 1 FROM about);

-- =========================
-- DEFAULT SETTINGS DATA
-- =========================
INSERT INTO settings (
  site_name,
  logo,
  whatsapp_number,
  email,
  address,
  instagram,
  facebook,
  tiktok,
  catalogue_title,
  catalogue_description,
  newsletter_title,
  newsletter_description,
  shop_title,
  opening_hours,
  shop_image,
  footer_description
)
SELECT
  'Steffi Metz',
  '/assets/image-1.png',
  '+250 785 211 051',
  'hello@steffimetz.rw',
  'Kigali, Rwanda',
  '',
  '',
  '',
  'Browse the complete catalogue',
  'From individual products to full gourmet boxes — everything on WhatsApp. Members always receive their discount automatically.',
  'Recipes & offers, in your inbox',
  'Exclusive recipes, product launches and event invitations — no spam, just handmade goodness.',
  'Find the Gourmet Shop',
  'Mon - Fri: 09:00 - 18:00
Sat: 10:00 - 14:00',
  '/assets/image-13.jpg',
  'Artisan foods, catering, gourmet gift boxes, cooking classes and unforgettable culinary experiences handcrafted in Kigali.'
WHERE NOT EXISTS (SELECT 1 FROM settings);

-- =========================
-- SAMPLE BOXES
-- =========================
INSERT INTO boxes (name, price, serves, items, image, status)
SELECT
  'The Gourmet Picnic Box',
  '52,000',
  '2',
  'Sourdough Bread, Rosemary Focaccia, Hummus, Baba Ganoush, Herb Dip, Marinated Olives, Sun-Dried Tomatoes, 2 × Kombucha',
  '/assets/image-6.jpg',
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM boxes WHERE name = 'The Gourmet Picnic Box'
);

INSERT INTO boxes (name, price, serves, items, image, status)
SELECT
  'The Artisan Dip Box',
  '45,000',
  '2',
  'Sourdough Bread, Rosemary Focaccia, Hummus, Muhammara, Herb Dip, Marinated Olives, Sun-Dried Tomatoes',
  '/assets/image-7.jpg',
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM boxes WHERE name = 'The Artisan Dip Box'
);

INSERT INTO boxes (name, price, serves, items, image, status)
SELECT
  'The Pretzel & Cheese Box',
  '39,000',
  '2',
  '2 Fresh Pretzels, Hummus, Artisan Cheese, Premium Nuts, 2 × Kombucha',
  '/assets/image-8.jpg',
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM boxes WHERE name = 'The Pretzel & Cheese Box'
);

-- =========================
-- SAMPLE EVENTS
-- =========================
INSERT INTO events (title, price, badge, description, image, status)
SELECT
  'Cooking Classes',
  'From 35,000 RWF',
  'Weekly',
  'Hands-on sessions for bread, dips, fermented drinks and seasonal menus.',
  '/assets/image-12.jpg',
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM events WHERE title = 'Cooking Classes'
);

INSERT INTO events (title, price, badge, description, image, status)
SELECT
  'Tasting Evenings',
  'From 25,000 RWF',
  'Limited seats',
  'Small-group tasting nights featuring artisan cheese, kombucha, sourdough and gourmet pairings.',
  '/assets/image-12.jpg',
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM events WHERE title = 'Tasting Evenings'
);

INSERT INTO events (title, price, badge, description, image, status)
SELECT
  'Private Catering',
  'Custom quote',
  'On request',
  'Grazing tables, gourmet boxes and healthy menus for birthdays, team days and family events.',
  '/assets/image-12.jpg',
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM events WHERE title = 'Private Catering'
);

-- =========================
-- DEFAULT LOYALTY TIERS
-- =========================
INSERT INTO loyalty_tiers (
  icon,
  name,
  monthly_spend,
  discount,
  benefits,
  sort_order,
  status
)
SELECT
  '🌱',
  'Gourmet Curious',
  '0 RWF/month',
  '0%',
  'App access & community · Free monthly recipe',
  1,
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM loyalty_tiers WHERE name = 'Gourmet Curious'
);

INSERT INTO loyalty_tiers (
  icon,
  name,
  monthly_spend,
  discount,
  benefits,
  sort_order,
  status
)
SELECT
  '⭐',
  'Gourmet Regular',
  '100,000 RWF/month',
  '10%',
  '10% off all boxes & products · Priority event booking',
  2,
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM loyalty_tiers WHERE name = 'Gourmet Regular'
);

INSERT INTO loyalty_tiers (
  icon,
  name,
  monthly_spend,
  discount,
  benefits,
  sort_order,
  status
)
SELECT
  '🥇',
  'Gourmet Gold',
  '250,000 RWF/month',
  '15%',
  '15% off everything · 1 free event per month',
  3,
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM loyalty_tiers WHERE name = 'Gourmet Gold'
);

INSERT INTO loyalty_tiers (
  icon,
  name,
  monthly_spend,
  discount,
  benefits,
  sort_order,
  status
)
SELECT
  '💎',
  'Gourmet Connoisseur',
  '500,000 RWF/month',
  '20%',
  '20% off all orders · All regular events at no cost',
  4,
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM loyalty_tiers WHERE name = 'Gourmet Connoisseur'
);

INSERT INTO loyalty_tiers (
  icon,
  name,
  monthly_spend,
  discount,
  benefits,
  sort_order,
  status
)
SELECT
  '👑',
  'Gourmet VIP',
  '1,000,000 RWF/month',
  '25%',
  '25% off everything, always · All events permanently included',
  5,
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM loyalty_tiers WHERE name = 'Gourmet VIP'
);

-- =========================
-- DEFAULT MARQUEE ITEMS
-- =========================
INSERT INTO marquee_items (text, sort_order, status)
SELECT 'Fresh sourdough daily', 1, 'active'
WHERE NOT EXISTS (
  SELECT 1 FROM marquee_items WHERE text = 'Fresh sourdough daily'
);

INSERT INTO marquee_items (text, sort_order, status)
SELECT 'Handmade in Kigali', 2, 'active'
WHERE NOT EXISTS (
  SELECT 1 FROM marquee_items WHERE text = 'Handmade in Kigali'
);

INSERT INTO marquee_items (text, sort_order, status)
SELECT 'Gourmet boxes available', 3, 'active'
WHERE NOT EXISTS (
  SELECT 1 FROM marquee_items WHERE text = 'Gourmet boxes available'
);

INSERT INTO marquee_items (text, sort_order, status)
SELECT 'Cooking classes and events', 4, 'active'
WHERE NOT EXISTS (
  SELECT 1 FROM marquee_items WHERE text = 'Cooking classes and events'
);