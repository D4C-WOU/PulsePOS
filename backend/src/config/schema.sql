CREATE DATABASE IF NOT EXISTS odoo_cafe_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE odoo_cafe_pos;

-- ─── USERS ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100)  NOT NULL,
  email        VARCHAR(150)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role         ENUM('admin', 'employee') NOT NULL DEFAULT 'employee',
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── CATEGORIES ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  color      VARCHAR(20)  NOT NULL DEFAULT '#52B788',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── PRODUCTS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(150) NOT NULL,
  category_id     INT,
  price           DECIMAL(10,2) NOT NULL,
  unit_of_measure VARCHAR(50)   NOT NULL DEFAULT 'per piece',
  tax_percentage  DECIMAL(5,2)  NOT NULL DEFAULT 0.00,
  description     TEXT,
  show_on_kds     BOOLEAN NOT NULL DEFAULT TRUE,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ─── FLOORS ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS floors (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── TABLES ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `tables` (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  floor_id     INT NOT NULL,
  table_number VARCHAR(20) NOT NULL,
  seats        INT NOT NULL DEFAULT 4,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  FOREIGN KEY (floor_id) REFERENCES floors(id) ON DELETE CASCADE
);

-- ─── PAYMENT METHODS ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payment_methods (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  type       ENUM('cash', 'card', 'upi') NOT NULL UNIQUE,
  is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  upi_id     VARCHAR(100)
);

-- ─── COUPONS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coupons (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  code           VARCHAR(50) NOT NULL UNIQUE,
  discount_type  ENUM('percentage', 'fixed') NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── PROMOTIONS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS promotions (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(150) NOT NULL,
  promotion_type   ENUM('product', 'order') NOT NULL,
  product_id       INT DEFAULT NULL,
  min_quantity     INT DEFAULT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT NULL,
  discount_type    ENUM('percentage', 'fixed') NOT NULL,
  discount_value   DECIMAL(10,2) NOT NULL,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- ─── CUSTOMERS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customers (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150),
  phone      VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── SESSIONS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sessions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  opened_by     INT NOT NULL,
  opened_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  closed_at     TIMESTAMP NULL,
  closing_total DECIMAL(12,2) DEFAULT 0.00,
  status        ENUM('open', 'closed') NOT NULL DEFAULT 'open',
  FOREIGN KEY (opened_by) REFERENCES users(id)
);

-- ─── ORDERS ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  order_number    VARCHAR(30) NOT NULL UNIQUE,
  session_id      INT NOT NULL,
  table_id        INT,
  customer_id     INT,
  employee_id     INT NOT NULL,
  status          ENUM('draft', 'sent_to_kds', 'paid', 'cancelled') NOT NULL DEFAULT 'draft',
  subtotal        DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  tax_amount      DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total           DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  coupon_code     VARCHAR(50),
  notes           TEXT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paid_at         TIMESTAMP NULL,
  FOREIGN KEY (session_id)  REFERENCES sessions(id),
  FOREIGN KEY (table_id)    REFERENCES `tables`(id) ON DELETE SET NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  FOREIGN KEY (employee_id) REFERENCES users(id)
);

-- ─── ORDER ITEMS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  order_id       INT NOT NULL,
  product_id     INT NOT NULL,
  product_name   VARCHAR(150) NOT NULL,    -- snapshot at time of order
  quantity       INT NOT NULL DEFAULT 1,
  unit_price     DECIMAL(10,2) NOT NULL,   -- snapshot at time of order
  tax_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  item_discount  DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  line_total     DECIMAL(10,2) NOT NULL,
  kds_status     ENUM('none', 'to_cook', 'preparing', 'completed') NOT NULL DEFAULT 'none',
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id)   REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ─── KDS TICKETS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kds_tickets (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL UNIQUE,
  stage    ENUM('to_cook', 'preparing', 'completed') NOT NULL DEFAULT 'to_cook',
  sent_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ─── KDS ITEM PROGRESS ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kds_item_progress (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  kds_ticket_id INT NOT NULL,
  order_item_id INT NOT NULL,
  is_completed  BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (kds_ticket_id) REFERENCES kds_tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE
);

-- ─── PAYMENTS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  order_id           INT NOT NULL,
  payment_method     ENUM('cash', 'card', 'upi') NOT NULL,
  amount_received    DECIMAL(10,2) NOT NULL,
  change_given       DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  reference          VARCHAR(100),
  polar_checkout_id  VARCHAR(255),
  status             ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
  created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ─── BOOKINGS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  customer_id  INT,
  table_id     INT,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  guests       INT NOT NULL DEFAULT 1,
  notes        TEXT,
  status       ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  FOREIGN KEY (table_id)    REFERENCES `tables`(id) ON DELETE SET NULL
);

-- ─── DEFAULT SEED FOR PAYMENT METHODS ───
INSERT INTO payment_methods (type, is_enabled) VALUES
  ('cash', TRUE), ('card', FALSE), ('upi', FALSE)
  ON DUPLICATE KEY UPDATE type=type;
