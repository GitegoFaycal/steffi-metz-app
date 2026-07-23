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
  'European chef, Kigali heart',
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
  tiktok
)
SELECT
  'Steffi Metz',
  '/assets/image-1.png',
  '+250 785 211 051',
  'hello@steffimetz.rw',
  'Kigali, Rwanda',
  '',
  '',
  ''
WHERE NOT EXISTS (SELECT 1 FROM settings);

-- =========================
-- SAMPLE BOXES
-- =========================
INSERT INTO boxes (name, price, serves, items, image)
SELECT 'The Gourmet Picnic Box', '52,000', '2', 'Sourdough Bread, Rosemary Focaccia, Hummus, Baba Ganoush, Herb Dip, Marinated Olives, Sun-Dried Tomatoes, 2 × Kombucha', '/assets/image-6.jpg'
WHERE NOT EXISTS (SELECT 1 FROM boxes WHERE name = 'The Gourmet Picnic Box');

INSERT INTO boxes (name, price, serves, items, image)
SELECT 'The Artisan Dip Box', '45,000', '2', 'Sourdough Bread, Rosemary Focaccia, Hummus, Muhammara, Herb Dip, Marinated Olives, Sun-Dried Tomatoes', '/assets/image-7.jpg'
WHERE NOT EXISTS (SELECT 1 FROM boxes WHERE name = 'The Artisan Dip Box');

INSERT INTO boxes (name, price, serves, items, image)
SELECT 'The Pretzel & Cheese Box', '39,000', '2', '2 Fresh Pretzels, Hummus, Artisan Cheese, Premium Nuts, 2 × Kombucha', '/assets/image-8.jpg'
WHERE NOT EXISTS (SELECT 1 FROM boxes WHERE name = 'The Pretzel & Cheese Box');

-- =========================
-- SAMPLE EVENTS
-- =========================
INSERT INTO events (title, price, badge, description, image)
SELECT 'Cooking Classes', 'From 35,000 RWF', 'Weekly', 'Hands-on sessions for bread, dips, fermented drinks and seasonal menus.', '/assets/image-12.jpg'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Cooking Classes');

INSERT INTO events (title, price, badge, description, image)
SELECT 'Tasting Evenings', 'From 25,000 RWF', 'Limited seats', 'Small-group tasting nights featuring artisan cheese, kombucha, sourdough and gourmet pairings.', '/assets/image-12.jpg'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Tasting Evenings');

INSERT INTO events (title, price, badge, description, image)
SELECT 'Private Catering', 'Custom quote', 'On request', 'Grazing tables, gourmet boxes and healthy menus for birthdays, team days and family events.', '/assets/image-12.jpg'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Private Catering');