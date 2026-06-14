# ODOO CAFE POS — COMPLETE AI AGENT BUILD PROMPT

> **Instructions to AI Agent**: Build the complete, fully-functional Odoo Cafe POS web application exactly as described below. Every section is mandatory. Do not skip, simplify, or stub any feature. Write production-quality code with comments. The entire system must work end-to-end.

---

## 1. PROJECT OVERVIEW

Build a full-stack, web-based Restaurant Point-of-Sale (POS) system called **"Odoo Cafe POS"**. This is a solo-developer hackathon project. The system consists of **three distinct surfaces**:

1. **Backend / Admin Panel** — React SPA for the admin (User role) to configure everything (products, tables, promotions, employees, etc.)
2. **POS Terminal** — React SPA for the Employee role to take orders, process payments, manage tables and customers
3. **Kitchen Display System (KDS)** — A separate React page at a fixed URL (`/kds`), intended to run on a dedicated kitchen monitor with no auth required, showing real-time order tickets

**Three roles:**

- **Admin (User)**: Configures the system from the backend panel
- **Employee (Cashier)**: Operates the POS terminal
- **Customer**: Managed by employees from within the POS terminal

---

## 2. TECH STACK — USE EXACTLY THESE

### Frontend

| Tool         | Version / Notes                       |
| ------------ | ------------------------------------- |
| React        | v18 + Vite                            |
| Routing      | React Router DOM v6                   |
| Styling      | TailwindCSS v3 + custom CSS variables |
| Global State | Zustand                               |
| Server State | TanStack Query (React Query) v5       |
| HTTP         | Axios                                 |
| Real-time    | socket.io-client                      |
| Charts       | Recharts                              |
| QR Code      | qrcode.react                          |
| PDF Export   | jsPDF + jspdf-autotable               |
| XLS Export   | SheetJS (xlsx)                        |
| Toasts       | react-hot-toast                       |
| Icons        | Lucide React                          |
| Dates        | date-fns                              |
| Forms        | React Hook Form                       |

### Backend

| Tool        | Version / Notes                          |
| ----------- | ---------------------------------------- |
| Runtime     | Node.js v20+                             |
| Framework   | Express.js v4                            |
| Database    | MySQL 8+ (mysql2 with promise wrapper)   |
| Real-time   | socket.io v4                             |
| Auth        | jsonwebtoken + bcryptjs                  |
| Email       | Nodemailer (Ethereal SMTP for dev)       |
| QR (server) | qrcode npm package                       |
| Env         | dotenv                                   |
| Middleware  | cors, helmet, morgan, express-rate-limit |
| Validation  | express-validator                        |
| Payment     | Polar.sh API (sandbox mode)              |
| Dev         | nodemon, concurrently                    |

---

## 3. COLOR & DESIGN SYSTEM — APPLY GLOBALLY

Define these as Tailwind config extensions AND CSS variables in `index.css`:

```css
:root {
  --color-bg-deep: #0d1f16;
  --color-bg-card: #132a1e;
  --color-bg-surface: #1a3c34;
  --color-green-dark: #2d6a4f;
  --color-green-mid: #52b788;
  --color-green-light: #95d5b2;
  --color-green-pale: #d8f3dc;
  --color-beige-dark: #c9a96e;
  --color-beige-mid: #f0d9a0;
  --color-beige-light: #fefae0;
  --color-beige-pale: #faf3e0;
  --color-border: #2d4a3e;
  --color-text-primary: #fefae0;
  --color-text-secondary: #95d5b2;
  --color-text-muted: #6b8f71;
  --color-danger: #b22222;
  --color-warning: #d97706;
  --color-success: #16a34a;
}
```

**Design rules (enforce throughout):**

- Admin backend: `#0D1F16` page background, `#132A1E` card/panel surfaces, beige text
- POS Terminal: `#1B4332` background (slightly lighter for the work environment feel)
- KDS: `#0D1F16` deep dark with vibrant stage-color badges
- All primary action buttons: `bg-[#2D6A4F]` text-beige, hover `bg-[#52B788]`
- Danger buttons: `bg-[#B22222]`
- All cards: `border border-[#2D4A3E]` + `rounded-lg` (8px)
- Active/selected states: `border-[#52B788]` + very light green bg tint
- Font: **Inter** (import from Google Fonts). Weight 400 for body, 600 for labels, 700 for headings.
- Inputs: `bg-[#0D2818]` background, `border-[#95D5B2]` border, beige text, `focus:ring-[#52B788]` focus ring
- Use `₹` (Indian Rupee symbol) everywhere prices appear — NOT `$`
- Table rows: alternating opacity trick `odd:bg-opacity-100 even:bg-opacity-50`
- All modals: dark overlay (`bg-black/60 backdrop-blur-sm`), centered card with `bg-[#132A1E]` and `border-[#2D4A3E]`

---

## 4. COMPLETE FILE & FOLDER STRUCTURE

```
odoo-cafe-pos/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                  # MySQL2 connection pool (promise)
│   │   │   ├── socket.js              # Socket.io server setup, room management
│   │   │   └── seed.js                # Seed data script (npm run seed)
│   │   ├── middleware/
│   │   │   ├── auth.js                # JWT verify → req.user
│   │   │   ├── roleCheck.js           # requireAdmin, requireEmployee
│   │   │   └── errorHandler.js        # Global error handler
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── product.routes.js
│   │   │   ├── category.routes.js
│   │   │   ├── paymentMethod.routes.js
│   │   │   ├── floor.routes.js
│   │   │   ├── table.routes.js
│   │   │   ├── coupon.routes.js
│   │   │   ├── promotion.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── session.routes.js
│   │   │   ├── order.routes.js
│   │   │   ├── customer.routes.js
│   │   │   ├── kds.routes.js
│   │   │   ├── payment.routes.js
│   │   │   └── report.routes.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── product.controller.js
│   │   │   ├── category.controller.js
│   │   │   ├── paymentMethod.controller.js
│   │   │   ├── floor.controller.js
│   │   │   ├── table.controller.js
│   │   │   ├── coupon.controller.js
│   │   │   ├── promotion.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── session.controller.js
│   │   │   ├── order.controller.js
│   │   │   ├── customer.controller.js
│   │   │   ├── kds.controller.js
│   │   │   ├── payment.controller.js
│   │   │   └── report.controller.js
│   │   ├── services/
│   │   │   ├── promotion.service.js   # Auto-promotion calculation logic
│   │   │   ├── email.service.js       # Nodemailer HTML receipt email
│   │   │   └── polar.service.js       # Polar.sh API calls
│   │   └── app.js                     # Express app entry point
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/                       # One Axios file per resource
│   │   │   ├── axiosInstance.js       # Base axios with interceptors
│   │   │   ├── auth.api.js
│   │   │   ├── product.api.js
│   │   │   ├── category.api.js
│   │   │   ├── paymentMethod.api.js
│   │   │   ├── floor.api.js
│   │   │   ├── table.api.js
│   │   │   ├── coupon.api.js
│   │   │   ├── promotion.api.js
│   │   │   ├── user.api.js
│   │   │   ├── session.api.js
│   │   │   ├── order.api.js
│   │   │   ├── customer.api.js
│   │   │   ├── kds.api.js
│   │   │   ├── payment.api.js
│   │   │   └── report.api.js
│   │   ├── assets/
│   │   │   └── logo.svg               # Cafe logo (SVG coffee cup)
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx         # Variants: primary, danger, ghost, outline
│   │   │   │   ├── Modal.jsx          # Reusable modal with overlay
│   │   │   │   ├── Input.jsx          # Styled input with label + error
│   │   │   │   ├── Badge.jsx          # Status badges (color variants)
│   │   │   │   ├── DataTable.jsx      # Reusable table with empty state
│   │   │   │   ├── Spinner.jsx        # Loading spinner
│   │   │   │   ├── ConfirmDialog.jsx  # "Are you sure?" modal
│   │   │   │   ├── Toggle.jsx         # Toggle switch component
│   │   │   │   └── EmptyState.jsx     # Icon + message for empty lists
│   │   │   ├── backend/
│   │   │   │   ├── Sidebar.jsx        # Left nav sidebar with all backend links
│   │   │   │   ├── TopBar.jsx         # Top bar with page title + user info
│   │   │   │   └── BackendLayout.jsx  # Wraps Sidebar + TopBar + children
│   │   │   └── pos/
│   │   │       ├── POSNavbar.jsx      # Top nav bar for POS
│   │   │       ├── FloorPopup.jsx     # Floor/table selection modal
│   │   │       ├── ProductCard.jsx    # Product card in order view
│   │   │       ├── CartItem.jsx       # Single cart line item
│   │   │       ├── OrderSummary.jsx   # Subtotal/tax/discount/total block
│   │   │       ├── PaymentPanel.jsx   # Payment method selection + sub-panels
│   │   │       ├── CashPayment.jsx    # Cash amount + change display
│   │   │       ├── CardPayment.jsx    # Polar checkout flow
│   │   │       ├── UPIPayment.jsx     # QR code + confirm button
│   │   │       ├── DiscountPopup.jsx  # Coupon code entry modal
│   │   │       ├── CustomerModal.jsx  # Search/create/assign customer
│   │   │       ├── EmailReceiptModal.jsx
│   │   │       ├── PrintableReceipt.jsx # Hidden div for window.print()
│   │   │       └── KDSTicket.jsx      # Ticket card for KDS page
│   │   ├── hooks/
│   │   │   ├── useAuth.js             # Auth state from Zustand
│   │   │   ├── useSocket.js           # Socket.io connection + auto-reconnect
│   │   │   └── useSession.js          # Active session state
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Signup.jsx
│   │   │   ├── backend/
│   │   │   │   ├── Dashboard.jsx      # Reports & analytics
│   │   │   │   ├── Products.jsx
│   │   │   │   ├── Categories.jsx
│   │   │   │   ├── PaymentMethods.jsx
│   │   │   │   ├── Floors.jsx
│   │   │   │   ├── Coupons.jsx
│   │   │   │   ├── Promotions.jsx
│   │   │   │   └── Users.jsx
│   │   │   ├── pos/
│   │   │   │   ├── POSMain.jsx        # Main 3-column order view
│   │   │   │   ├── OrdersList.jsx     # All session orders list
│   │   │   │   ├── OrderDetail.jsx    # Single order detail/edit
│   │   │   │   ├── Customers.jsx      # Customer management
│   │   │   │   └── TableView.jsx      # Full-page floor/table grid
│   │   │   └── kds/
│   │   │       └── KitchenDisplay.jsx # Kitchen display (no auth)
│   │   ├── store/
│   │   │   ├── authStore.js           # Zustand: { user, token, setUser, logout }
│   │   │   ├── cartStore.js           # Zustand: { items, activeOrder, table, discounts, totals }
│   │   │   └── sessionStore.js        # Zustand: { session, setSession }
│   │   ├── router/
│   │   │   └── AppRouter.jsx          # All routes with ProtectedRoute + AdminRoute wrappers
│   │   ├── utils/
│   │   │   ├── formatCurrency.js      # formatCurrency(1234.5) → "₹1,234.50"
│   │   │   ├── formatDate.js          # Various date formatters using date-fns
│   │   │   ├── exportPDF.js           # jsPDF report generation
│   │   │   └── exportXLS.js           # SheetJS report generation
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js             # Extend colors with all design system values
│   ├── index.html
│   └── package.json
│
└── README.md                          # Setup + run instructions
```

---

## 5. DATABASE SCHEMA — MYSQL DDL (RUN IN ORDER)

```sql
CREATE DATABASE IF NOT EXISTS odoo_cafe_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE odoo_cafe_pos;

-- ─── USERS ────────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100)  NOT NULL,
  email        VARCHAR(150)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role         ENUM('admin', 'employee') NOT NULL DEFAULT 'employee',
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── CATEGORIES ───────────────────────────────────────────────────────────────
CREATE TABLE categories (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  color      VARCHAR(20)  NOT NULL DEFAULT '#52B788',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── PRODUCTS ─────────────────────────────────────────────────────────────────
CREATE TABLE products (
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
CREATE TABLE floors (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── TABLES ───────────────────────────────────────────────────────────────────
CREATE TABLE `tables` (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  floor_id     INT NOT NULL,
  table_number VARCHAR(20) NOT NULL,
  seats        INT NOT NULL DEFAULT 4,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  FOREIGN KEY (floor_id) REFERENCES floors(id) ON DELETE CASCADE
);

-- ─── PAYMENT METHODS ──────────────────────────────────────────────────────────
CREATE TABLE payment_methods (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  type       ENUM('cash', 'card', 'upi') NOT NULL UNIQUE,
  is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  upi_id     VARCHAR(100)
);
INSERT INTO payment_methods (type, is_enabled) VALUES
  ('cash', TRUE), ('card', FALSE), ('upi', FALSE);

-- ─── COUPONS ──────────────────────────────────────────────────────────────────
CREATE TABLE coupons (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  code           VARCHAR(50) NOT NULL UNIQUE,
  discount_type  ENUM('percentage', 'fixed') NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── PROMOTIONS ───────────────────────────────────────────────────────────────
CREATE TABLE promotions (
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
CREATE TABLE customers (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150),
  phone      VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── SESSIONS ─────────────────────────────────────────────────────────────────
CREATE TABLE sessions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  opened_by     INT NOT NULL,
  opened_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  closed_at     TIMESTAMP NULL,
  closing_total DECIMAL(12,2) DEFAULT 0.00,
  status        ENUM('open', 'closed') NOT NULL DEFAULT 'open',
  FOREIGN KEY (opened_by) REFERENCES users(id)
);

-- ─── ORDERS ───────────────────────────────────────────────────────────────────
CREATE TABLE orders (
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
CREATE TABLE order_items (
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
CREATE TABLE kds_tickets (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL UNIQUE,
  stage    ENUM('to_cook', 'preparing', 'completed') NOT NULL DEFAULT 'to_cook',
  sent_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ─── KDS ITEM PROGRESS ────────────────────────────────────────────────────────
CREATE TABLE kds_item_progress (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  kds_ticket_id INT NOT NULL,
  order_item_id INT NOT NULL,
  is_completed  BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (kds_ticket_id) REFERENCES kds_tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE
);

-- ─── PAYMENTS ─────────────────────────────────────────────────────────────────
CREATE TABLE payments (
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
CREATE TABLE bookings (
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
```

---

## 6. BACKEND — ENVIRONMENT VARIABLES (.env)

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=odoo_cafe_pos

JWT_SECRET=change_this_to_a_long_random_secret_string
JWT_EXPIRES_IN=7d

EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=ethereal_generated_user
EMAIL_PASS=ethereal_generated_pass
EMAIL_FROM="Odoo Cafe <cafe@odoocafe.com>"

POLAR_ACCESS_TOKEN=polar_sandbox_access_token_here
POLAR_WEBHOOK_SECRET=polar_webhook_secret_here
POLAR_PRODUCT_PRICE_ID=polar_price_id_for_generic_payment

FRONTEND_URL=http://localhost:5173
```

---

## 7. BACKEND — ARCHITECTURE & MIDDLEWARE

### db.js — MySQL Pool

```javascript
// src/config/db.js
const mysql = require("mysql2/promise");
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
module.exports = pool;
```

### auth.js Middleware

- Extract token from `Authorization: Bearer <token>` header
- Verify with `jwt.verify(token, process.env.JWT_SECRET)`
- Attach decoded payload as `req.user = { id, name, email, role }`
- Also check `users.is_active = true` via a DB query on each request
- Return 401 if token missing/expired, 403 if user archived

### roleCheck.js Middleware

```javascript
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res
      .status(403)
      .json({ success: false, message: "Admin access required" });
  next();
};
const requireEmployee = (req, res, next) => {
  // both admin and employee can access
  if (!req.user)
    return res
      .status(401)
      .json({ success: false, message: "Authentication required" });
  next();
};
```

### errorHandler.js

```javascript
// All routes call next(err) on failures
module.exports = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
    errors: err.errors || [],
  });
};
```

### app.js

```javascript
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL, methods: ["GET", "POST"] },
});

// Attach io to app so controllers can emit events
app.set("io", io);

// Socket.io room management
io.on("connection", (socket) => {
  socket.on("join:kds", () => socket.join("kds"));
  socket.on("join:pos", () => socket.join("pos"));
  socket.on("disconnect", () => {});
});

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// Mount all routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/floors", require("./routes/floor.routes"));
app.use("/api/tables", require("./routes/table.routes"));
app.use("/api/payment-methods", require("./routes/paymentMethod.routes"));
app.use("/api/coupons", require("./routes/coupon.routes"));
app.use("/api/promotions", require("./routes/promotion.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/sessions", require("./routes/session.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/customers", require("./routes/customer.routes"));
app.use("/api/kds", require("./routes/kds.routes"));
app.use("/api/payments", require("./routes/payment.routes"));
app.use("/api/reports", require("./routes/report.routes"));

app.use(require("./middleware/errorHandler"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## 8. BACKEND — ALL API ENDPOINTS (COMPLETE)

> **Unified response format always:**
> Success: `{ success: true, data: <payload>, message: "optional" }`
> Error: `{ success: false, message: "Human-readable error", errors: [] }`

---

### 8.1 AUTH — `/api/auth`

**POST `/signup`**

- Body: `{ name, email, password }`
- Validate: name non-empty, email valid format, password min 8 chars
- Check email not already in users table
- Hash password: `bcrypt.hash(password, 12)`
- Signup page always creates role = 'admin' (employees are created from User Management)
- Insert user, generate JWT, return `{ token, user: { id, name, email, role } }`

**POST `/login`**

- Body: `{ email, password }`
- Find user by email, check `is_active = true`
- `bcrypt.compare(password, user.password_hash)`
- On match: generate JWT with payload `{ id, name, email, role }`
- Return `{ token, user: { id, name, email, role } }`

**GET `/me`** _(protected)_

- Return `req.user` details

---

### 8.2 CATEGORIES — `/api/categories` (all protected)

**GET `/`**

- SELECT all categories ORDER BY name
- Returns: `[{ id, name, color, created_at }]`

**POST `/`** _(admin only)_

- Body: `{ name, color }`
- Validate name unique, color is valid CSS hex

**PUT `/:id`** _(admin only)_

- Body: `{ name, color }` — update and return updated row
- Changing color here must automatically appear everywhere in POS (frontend re-fetches categories reactively)

**DELETE `/:id`** _(admin only)_

- Delete category; due to ON DELETE SET NULL, products with this category get `category_id = NULL`

---

### 8.3 PRODUCTS — `/api/products` (all protected)

**GET `/`**

- Query: `?category_id=&search=&is_active=true` (default is_active=true)
- JOIN categories: return each product with `category: { id, name, color }`
- Full response shape: `{ id, name, price, unit_of_measure, tax_percentage, description, show_on_kds, is_active, category }`

**POST `/`** _(admin only)_

- Body: `{ name, category_id, price, unit_of_measure, tax_percentage, description, show_on_kds }`
- Validate price > 0, tax_percentage 0–100

**PUT `/:id`** _(admin only)_

- Body: same as POST — update and return

**DELETE `/:id`** _(admin only)_

- Soft delete: `UPDATE products SET is_active = FALSE WHERE id = ?`
- (Keeps order history intact)

---

### 8.4 FLOORS — `/api/floors` (all protected)

**GET `/`**

- Return all floors with their tables nested + `has_active_order` bool per table
- `has_active_order = TRUE` if any order with `status IN ('draft', 'sent_to_kds')` references that table

```javascript
// Pseudo-SQL
SELECT f.*, t.*,
  EXISTS(SELECT 1 FROM orders o WHERE o.table_id = t.id AND o.status IN ('draft','sent_to_kds')) AS has_active_order
FROM floors f
LEFT JOIN tables t ON t.floor_id = f.id
ORDER BY f.id, t.table_number
```

**POST `/`** _(admin only)_ — Body: `{ name }`

**PUT `/:id`** _(admin only)_ — Body: `{ name }`

**DELETE `/:id`** _(admin only)_ — Cascades to delete all tables under floor

---

### 8.5 TABLES — `/api/tables` (all protected)

**GET `/`** — Query: `?floor_id=` — Return tables with `has_active_order`

**POST `/`** _(admin only)_ — Body: `{ floor_id, table_number, seats, is_active }`

**PUT `/:id`** _(admin only)_ — Body: `{ table_number, seats, is_active }`

**DELETE `/:id`** _(admin only)_

---

### 8.6 PAYMENT METHODS — `/api/payment-methods` (all protected)

**GET `/`** — Return all 3 rows: `[{ id, type, is_enabled, upi_id }]`

**PUT `/:id`** _(admin only)_

- Body: `{ is_enabled, upi_id }`
- Validation: if `type = 'upi'` AND `is_enabled = true`, `upi_id` must be non-empty
- Update and return updated row

---

### 8.7 COUPONS — `/api/coupons` (all protected)

**GET `/`** — Return all coupons

**POST `/`** _(admin only)_

- Body: `{ code, discount_type, discount_value, is_active }`
- Normalize code to UPPERCASE before saving
- Validate code uniqueness

**PUT `/:id`** _(admin only)_ — Body: same (code normalized to uppercase)

**DELETE `/:id`** _(admin only)_

**POST `/validate`** _(employee+)_

- Body: `{ code, order_subtotal }`
- Normalize code to uppercase, find where `code = ? AND is_active = true`
- If not found: return 404 `{ success: false, message: "Invalid or expired coupon" }`
- Compute:
  ```
  if percentage: discount_amount = round(order_subtotal * (discount_value/100), 2)
  if fixed:      discount_amount = min(discount_value, order_subtotal)
  ```
- Return: `{ coupon: { id, code, discount_type, discount_value }, discount_amount }`

---

### 8.8 PROMOTIONS — `/api/promotions` (all protected)

**GET `/`** — Return all promotions; for product-type include product name

**POST `/`** _(admin only)_

- Body: `{ name, promotion_type, product_id?, min_quantity?, min_order_amount?, discount_type, discount_value, is_active }`
- Validate: if product type → product_id and min_quantity required; if order type → min_order_amount required

**PUT `/:id`** _(admin only)_ — Body: same

**DELETE `/:id`** _(admin only)_

**POST `/calculate`** _(employee+)_

- Body: `{ items: [{ product_id, quantity, unit_price }], subtotal }`
- Fetch all active promotions from DB
- **Product promotions loop**: for each cart item, find a promotion where `product_id = item.product_id AND min_quantity <= item.quantity`
  - If match: `item_discount = percentage ? round(item.unit_price * item.quantity * rate/100, 2) : discount_value`
- **Order promotions loop**: find all where `min_order_amount <= subtotal`, pick the ONE with highest discount value only
  - `order_discount = percentage ? round(subtotal * rate/100, 2) : discount_value`
- Return:
  ```json
  {
    "item_discounts": [
      { "product_id": 1, "discount_amount": 24.0, "promotion_name": "..." }
    ],
    "order_discount": 50.0,
    "order_promotion_name": "Big Order Deal",
    "applied_promotions": ["Buy 3 Coffees Get Discount", "Big Order Deal"]
  }
  ```

---

### 8.9 USERS — `/api/users` (all admin-only)

**GET `/`** — Return all users excluding `password_hash` field

**POST `/`**

- Body: `{ name, email, password, role }`
- Validate role is 'admin' or 'employee'; hash password; check email uniqueness

**PUT `/:id`** — Body: `{ name, email, role }`

**PUT `/:id/password`** — Body: `{ new_password }` — Hash and update

**PUT `/:id/archive`** — Toggle `is_active`: `UPDATE users SET is_active = NOT is_active WHERE id = ?`

**DELETE `/:id`**

- Check if user has any orders: `SELECT COUNT(*) FROM orders WHERE employee_id = ?`
- If orders exist: return 400 `{ message: "Cannot delete user with existing orders. Archive instead." }`
- Otherwise: hard delete

---

### 8.10 SESSIONS — `/api/sessions` (all protected)

**GET `/`** _(admin)_ — Return all sessions with `opened_by` user name, format: `{ id, user_name, opened_at, closed_at, status, closing_total }`

**GET `/active`** — Find session where `status = 'open'`; return it or `null`

**POST `/open`**

- Check if any session already has `status = 'open'`
- If yes: return existing session (idempotent)
- If no: `INSERT INTO sessions (opened_by, status) VALUES (req.user.id, 'open')`
- Return new session

**POST `/close/:id`**

- Verify session belongs to authenticated user (or user is admin)
- Server-side calculate closing_total: `SELECT SUM(total) FROM orders WHERE session_id = ? AND status = 'paid'`
- Count total orders: `SELECT COUNT(*) FROM orders WHERE session_id = ? AND status = 'paid'`
- Update: `closed_at = NOW(), status = 'closed', closing_total = calculated`
- Return: `{ session, summary: { total_orders, total_revenue, closing_total } }`

---

### 8.11 ORDERS — `/api/orders` (all employee+)

**GET `/`**

- Query: `?session_id=&status=&search=&customer_id=`
- JOIN customers, tables, users (employee)
- Search across order_number, customer.name
- Return paginated list: `[{ id, order_number, created_at, customer, table, employee, status, total }]`

**POST `/`**

- Body: `{ session_id, table_id?, customer_id?, items: [{ product_id, quantity }] }`
- **CRITICAL: Fetch all prices from DB, never trust client prices**
- Generate order_number: `ORD-${format(new Date(), 'yyyyMMdd')}-${String(dailyCount+1).padStart(4,'0')}`
- Call `promotionService.calculate(items, subtotal)` to get discounts
- Calculate:

  ```
  For each item:
    unit_price = product.price
    tax = unit_price * quantity * (product.tax_percentage/100)
    item_discount = from promotion service
    line_total = (unit_price * quantity) - item_discount

  subtotal     = sum(unit_price * quantity for all items)
  tax_amount   = sum(tax for all items)
  item_discounts_total = sum(item_discount for all items)
  order_discount = from promotion service
  discount_amount = item_discounts_total + order_discount
  total = subtotal + tax_amount - discount_amount
  ```

- INSERT into `orders`, then INSERT each item into `order_items`
- Return full order with items

**GET `/:id`** — Return order with all items, customer, table, employee, payment record

**PUT `/:id`**

- Only allow if `order.status = 'draft'`
- Body: `{ items, customer_id?, table_id?, coupon_code? }`
- Delete existing order_items, re-insert with recalculated values
- Re-run promotions; apply coupon if provided
- Update order totals

**DELETE `/:id`**

- Only allow if `order.status = 'draft'`
- Cascade deletes order_items due to FK

**POST `/:id/send-to-kds`**

- Fetch order with items; filter items where `product.show_on_kds = true`
- If no KDS items: return 400 `{ message: "No KDS-eligible items in this order" }`
- INSERT into `kds_tickets` (order_id, stage='to_cook')
- INSERT into `kds_item_progress` for each KDS-eligible item
- UPDATE `order.status = 'sent_to_kds'`
- UPDATE relevant `order_items.kds_status = 'to_cook'`
- Emit Socket.io: `io.to('kds').emit('kds:new_order', fullTicketPayload)`
  - Payload structure: `{ id, order_id, order_number, stage, sent_at, items: [{ kds_item_id, order_item_id, product_name, quantity, is_completed }] }`
- Return updated order

**POST `/:id/apply-coupon`**

- Body: `{ code }`
- Call coupon validate logic
- UPDATE order with coupon_code, recalculate discount_amount and total
- Return updated order

**POST `/:id/email-receipt`**

- Body: `{ email }`
- Call `emailService.sendReceipt(order, email)`
- Return `{ success: true, message: "Receipt sent to " + email }`

---

### 8.12 CUSTOMERS — `/api/customers` (all employee+)

**GET `/`** — Query: `?search=` (search name, email, phone via LIKE '%?%')

**POST `/`** — Body: `{ name, email?, phone? }`

**PUT `/:id`** — Body: `{ name, email, phone }`

**DELETE `/:id`** — Hard delete (check no orders reference this customer first; if yes, just unlink)

---

### 8.13 KDS — `/api/kds` (no auth required — public routes for KDS screen)

**GET `/tickets`**

- Query: `?stage=&product_id=&category_id=&search=&all=false`
- Default: return tickets where `stage IN ('to_cook', 'preparing')`
- If `?all=true`: include completed tickets
- Complex JOIN:
  ```sql
  SELECT kt.id, kt.order_id, o.order_number, kt.stage, kt.sent_at,
         kip.id AS kds_item_id, kip.order_item_id, kip.is_completed,
         oi.product_name, oi.quantity,
         p.id AS product_id, c.id AS category_id, c.name AS category_name
  FROM kds_tickets kt
  JOIN orders o ON o.id = kt.order_id
  JOIN kds_item_progress kip ON kip.kds_ticket_id = kt.id
  JOIN order_items oi ON oi.id = kip.order_item_id
  JOIN products p ON p.id = oi.product_id
  LEFT JOIN categories c ON c.id = p.category_id
  WHERE kt.stage IN ('to_cook','preparing')
  ```
- Group results by ticket, return nested `items[]`
- Apply search/category/product filters in WHERE clause

**PUT `/tickets/:id/stage`**

- Body: `{ stage: 'preparing' | 'completed' }`
- Validate: can only advance forward (to_cook → preparing → completed)
- UPDATE `kds_tickets SET stage = ? WHERE id = ?`
- If advancing to 'completed': `UPDATE kds_item_progress SET is_completed = true WHERE kds_ticket_id = ?`
- Emit: `io.to('kds').emit('kds:stage_updated', { ticket_id, order_id, new_stage })`
- Also emit: `io.to('pos').emit('table:status_changed', { table_id: order.table_id, has_active_order: new_stage !== 'completed' })`
- Return updated ticket

**PUT `/items/:id/complete`**

- Body: `{ is_completed: true | false }`
- UPDATE `kds_item_progress SET is_completed = ? WHERE id = ?`
- Emit: `io.to('kds').emit('kds:item_updated', { kds_item_id: id, is_completed })`
- Return updated item progress

---

### 8.14 PAYMENTS — `/api/payments`

**POST `/cash`** _(employee+)_

- Body: `{ order_id, amount_received }`
- Fetch order, validate `status = 'sent_to_kds' OR status = 'draft'`
- Validate `amount_received >= order.total`
- `change_given = round(amount_received - order.total, 2)`
- INSERT payment: `{ order_id, payment_method: 'cash', amount_received, change_given, status: 'completed' }`
- UPDATE order: `status = 'paid', paid_at = NOW()`
- Emit: `io.to('pos').emit('order:paid', { order_id, order_number, table_id: order.table_id })`
- Emit: `io.to('pos').emit('table:status_changed', { table_id: order.table_id, has_active_order: false })`
- Return: `{ payment, change_given, order }`

**POST `/card`** _(employee+)_

- Body: `{ order_id, reference }`
- INSERT payment: `{ order_id, payment_method: 'card', amount_received: order.total, reference, status: 'completed' }`
- UPDATE order: `status = 'paid'`
- Emit same events
- Return payment

**POST `/polar/create-checkout`** _(employee+)_

- Body: `{ order_id }`
- Fetch order
- Call `polarService.createCheckout(order)`:
  ```javascript
  // POST to Polar sandbox API
  // Create a checkout session with:
  // - amount = order.total (in INR paise if supported, else USD cents)
  // - success_url = FRONTEND_URL/pos?payment_success=true&order_id=X
  // - metadata = { order_id: string, order_number: string }
  ```
- INSERT payment with `status = 'pending'`, `polar_checkout_id = checkout.id`
- Return: `{ checkout_url: checkout.url, polar_checkout_id: checkout.id }`

**POST `/polar/webhook`** _(public — no auth)_

- Verify Polar webhook signature from request headers
- On event `checkout.order.completed` or equivalent:
  - Extract `order_id` from metadata
  - Find pending payment by `polar_checkout_id`
  - UPDATE payment: `status = 'completed'`
  - UPDATE order: `status = 'paid', paid_at = NOW()`
  - Emit `order:paid` and `table:status_changed`

**POST `/polar/simulate`** _(employee+ — dev/demo mode only)_

- Body: `{ order_id }`
- Directly mark the pending Polar payment as completed
- UPDATE order to paid
- Emit events
- **Add a comment: "REMOVE THIS ENDPOINT IN PRODUCTION"**

**GET `/upi-qr`** _(employee+)_

- Query: `?order_id=`
- Fetch `upi_id` from `payment_methods WHERE type = 'upi'`
- Fetch order total and order_number
- Build UPI string: `upi://pay?pa=${upi_id}&pn=Odoo%20Cafe&am=${order.total}&cu=INR&tn=Order%20${order.order_number}`
- Convert to QR: `const qr_base64 = await QRCode.toDataURL(upiString, { width: 300 })`
- Return: `{ qr_base64, upi_id, amount: order.total, order_number: order.order_number }`

**POST `/upi/confirm`** _(employee+)_

- Body: `{ order_id }`
- INSERT payment: `{ order_id, payment_method: 'upi', amount_received: order.total, status: 'completed' }`
- UPDATE order: `status = 'paid'`
- Emit events
- Return payment

---

### 8.15 REPORTS — `/api/reports` (admin only)

**GET `/dashboard`**

- Query: `?period=today|week|month|custom&start_date=&end_date=&employee_id=&session_id=&product_id=`

- Build dynamic date range:

  ```
  today:  WHERE DATE(o.created_at) = CURDATE()
  week:   WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
  month:  WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  custom: WHERE o.created_at BETWEEN ? AND ?
  ```

- Add optional filters: `AND o.employee_id = ?`, `AND o.session_id = ?`, `AND oi.product_id = ?`

- Run these queries:

  ```sql
  -- Summary
  SELECT COUNT(*) AS total_orders, SUM(total) AS revenue, AVG(total) AS avg_order_value
  FROM orders WHERE status = 'paid' AND <filters>

  -- Sales trend (daily grouping)
  SELECT DATE(created_at) AS date, SUM(total) AS revenue, COUNT(*) AS order_count
  FROM orders WHERE status = 'paid' AND <filters>
  GROUP BY DATE(created_at) ORDER BY date

  -- Top products
  SELECT oi.product_name, SUM(oi.quantity) AS quantity_sold, SUM(oi.line_total) AS revenue
  FROM order_items oi JOIN orders o ON o.id = oi.order_id
  WHERE o.status = 'paid' AND <filters>
  GROUP BY oi.product_name ORDER BY revenue DESC LIMIT 10

  -- Top categories
  SELECT c.name AS category_name, SUM(oi.line_total) AS revenue
  FROM order_items oi
  JOIN orders o ON o.id = oi.order_id
  JOIN products p ON p.id = oi.product_id
  JOIN categories c ON c.id = p.category_id
  WHERE o.status = 'paid' AND <filters>
  GROUP BY c.id, c.name ORDER BY revenue DESC

  -- Top orders
  SELECT o.order_number, cust.name AS customer_name, t.table_number, o.total, o.created_at
  FROM orders o
  LEFT JOIN customers cust ON cust.id = o.customer_id
  LEFT JOIN tables t ON t.id = o.table_id
  WHERE o.status = 'paid' AND <filters>
  ORDER BY o.total DESC LIMIT 10
  ```

- Add `percentage_of_total` to each category in top_categories_table
- Return combined JSON payload

---

## 9. EMAIL SERVICE (email.service.js)

```javascript
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const sendReceipt = async (order, email) => {
  const html = `
  <div style="font-family: Arial; max-width: 400px; margin: auto; background: #132A1E; color: #FEFAE0; padding: 20px; border-radius: 8px;">
    <h2 style="color: #95D5B2; text-align: center;">☕ Odoo Cafe POS</h2>
    <h3 style="text-align: center;">Receipt</h3>
    <p>Order: <strong>${order.order_number}</strong></p>
    <p>Date: ${format(new Date(order.created_at), "dd MMM yyyy, hh:mm a")}</p>
    <p>Table: ${order.table?.table_number || "Takeaway"}</p>
    <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
      <thead>
        <tr style="border-bottom: 1px solid #2D4A3E;">
          <th style="text-align:left;">Item</th>
          <th>Qty</th>
          <th style="text-align:right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.items
          .map(
            (item) => `
          <tr>
            <td>${item.product_name}</td>
            <td style="text-align:center;">${item.quantity}</td>
            <td style="text-align:right;">₹${item.line_total.toFixed(2)}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
    <hr style="border-color:#2D4A3E;" />
    <p>Subtotal: ₹${order.subtotal.toFixed(2)}</p>
    <p>Tax: ₹${order.tax_amount.toFixed(2)}</p>
    <p>Discount: −₹${order.discount_amount.toFixed(2)}</p>
    <p style="font-size:18px; font-weight:bold; color:#95D5B2;">Total: ₹${order.total.toFixed(2)}</p>
    <p style="text-align:center; color:#6B8F71; margin-top:20px;">Thank you for visiting Odoo Cafe! ☕</p>
  </div>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Receipt — Order ${order.order_number} — Odoo Cafe`,
    html,
  });
};
```

---

## 10. SOCKET.IO EVENTS — COMPLETE REFERENCE

### Server emits:

| Event                  | Room  | Payload                                | Trigger                           |
| ---------------------- | ----- | -------------------------------------- | --------------------------------- |
| `kds:new_order`        | `kds` | Full ticket object with nested items   | Employee clicks "Send to Kitchen" |
| `kds:stage_updated`    | `kds` | `{ ticket_id, order_id, new_stage }`   | Kitchen staff advances stage      |
| `kds:item_updated`     | `kds` | `{ kds_item_id, is_completed }`        | Kitchen staff toggles item        |
| `order:paid`           | `pos` | `{ order_id, order_number, table_id }` | Any payment completion            |
| `table:status_changed` | `pos` | `{ table_id, has_active_order: bool }` | Order paid or sent to KDS         |

### Client joins rooms:

```javascript
// In useSocket.js hook:
socket.emit("join:pos"); // POS terminal pages

// In KitchenDisplay.jsx:
socket.emit("join:kds");
```

### Frontend listeners:

- `kds:new_order` → prepend new ticket card with slide-in animation
- `kds:stage_updated` → find ticket by id, update stage badge and button
- `kds:item_updated` → find item row, toggle strikethrough
- `order:paid` → update order in OrdersList if visible; clear cart if matching active order
- `table:status_changed` → update table card color in FloorPopup / TableView

---

## 11. FRONTEND — ROUTING (AppRouter.jsx)

```jsx
// Route structure
<Routes>
  {/* Public */}
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/kds" element={<KitchenDisplay />} /> {/* No auth */}
  {/* Root redirect */}
  <Route path="/" element={<RootRedirect />} />{" "}
  {/* if logged in → /pos, else → /login */}
  {/* POS Terminal — requires any authenticated user */}
  <Route element={<ProtectedRoute />}>
    <Route path="/pos" element={<POSMain />} />
    <Route path="/pos/orders" element={<OrdersList />} />
    <Route path="/pos/orders/:id" element={<OrderDetail />} />
    <Route path="/pos/customers" element={<Customers />} />
    <Route path="/pos/table-view" element={<TableView />} />
  </Route>
  {/* Backend Admin — requires role = 'admin' */}
  <Route element={<AdminRoute />}>
    <Route path="/backend/dashboard" element={<Dashboard />} />
    <Route path="/backend/products" element={<Products />} />
    <Route path="/backend/categories" element={<Categories />} />
    <Route path="/backend/payment-methods" element={<PaymentMethods />} />
    <Route path="/backend/floors" element={<Floors />} />
    <Route path="/backend/coupons" element={<Coupons />} />
    <Route path="/backend/promotions" element={<Promotions />} />
    <Route path="/backend/users" element={<Users />} />
  </Route>
</Routes>
```

`ProtectedRoute`: checks `authStore.token`; if null, redirect to `/login`
`AdminRoute`: extends ProtectedRoute; if `user.role !== 'admin'`, redirect to `/pos`

---

## 12. FRONTEND — ALL PAGES IN COMPLETE DETAIL

### 12.1 Login.jsx & Signup.jsx

Full-page layout. Background: radial gradient from `#1A3C34` to `#0D1F16`.
Centered card `max-w-md` with logo + app name at top.

**Login card:**

- `☕ Odoo Cafe POS` heading in `#95D5B2`
- Sub-text: "Sign in to your account"
- Email input with Mail icon
- Password input with Lock icon + show/hide toggle (Eye/EyeOff from Lucide)
- Primary "Login" button (full width)
- Footer text: "New here? Create an account" → link to /signup
- On submit: POST /api/auth/login → store token + user in authStore + localStorage → redirect to `/pos`
- Show error toast (red) on wrong credentials

**Signup card:**

- Name, Email, Password inputs
- "Create Account" button
- Link to login
- On success: auto-login and redirect to `/pos`

### 12.2 Backend Layout (BackendLayout.jsx)

```
┌───────────────────────────────────────────────────┐
│ SIDEBAR (240px, fixed left, full height)          │
│  ☕ Odoo Cafe POS logo                            │
│  ─────────────                                    │
│  📊 Dashboard                                     │
│  📦 Products                                      │
│  🏷️  Categories                                    │
│  💳 Payment Methods                               │
│  🗺️  Floors & Tables                              │
│  🎫 Coupons                                       │
│  % Promotions                                     │
│  👥 Users                                         │
│  ─────────────                                    │
│  [→ Go to POS] button                             │
│  [Logout] button                                  │
├───────────────────────────────────────────────────┤
│ TOPBAR (64px, full width minus sidebar)           │
│ Left: Page Title                                  │
│ Right: User avatar circle (initials) + name       │
└───────────────────────────────────────────────────┘
│ CONTENT AREA (scrollable, padding 24px)           │
└───────────────────────────────────────────────────┘
```

Sidebar active item: `bg-[#52B788]/20 border-l-4 border-[#52B788]` with brighter text
Sidebar hover: `bg-[#2D4A3E]`

### 12.3 Dashboard.jsx (Reports & Analytics)

**Filter bar (sticky top, full width, `bg-[#132A1E]` panel):**

```
[ Period ▼ ] [ Employee ▼ ] [ Session ▼ ] [ Product ▼ ]   [Apply] [Export PDF] [Export XLS]
```

Period dropdown: Today | This Week | This Month | Custom Range
Custom range shows two date picker inputs (start_date, end_date)
All dropdowns populated from API
Clicking "Apply" → invalidate and refetch dashboard query
Export PDF → call `exportPDF(dashboardData)` utility
Export XLS → call `exportXLS(dashboardData)` utility

**Summary Metrics Row (3 cards):**
Each card: icon (Lucide) top-right, metric label, large number, small `₹` formatted

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  🛒 Total Orders  │  │  ₹ Revenue        │  │  📈 Avg Order     │
│                  │  │                  │  │                  │
│   1,248          │  │   ₹1,48,320       │  │   ₹118.80        │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

**Charts row (2 charts, 60/40 split):**

- Sales Trend (AreaChart from Recharts): X = date labels, Y = revenue in ₹. Toggle button group: "Revenue" / "Order Count" switches Y-axis data. Use `#52B788` fill color with 40% opacity area.
- Top Categories (PieChart / RadialBarChart): each slice colored by the actual category color from DB. Show legend below with category name + revenue.

**Data Tables (stacked, full width):**

1. Top Orders table: `#, Order #, Customer, Table, Amount (₹), Date` — 10 rows max
2. Top Products table: `#, Product Name, Category badge, Qty Sold, Revenue (₹)`
3. Top Categories table: `#, Category (colored dot + name), Revenue (₹), % of Total (progress bar)`

All tables use DataTable common component with alternating rows and empty state.

### 12.4 Products.jsx

**Header row:** "Products" h1 + "Add Product" button (right)
**Filter row:** Search input (live filter on product name) + Category dropdown + Active/Inactive toggle

**Products table:**
| Name | Category | Price | Tax | Unit | KDS | Status | Actions |
|---|---|---|---|---|---|---|---|
| Espresso | 🔴 Hot Drinks | ₹80.00 | 5% | per piece | ✓ | Active | ✏️🗑️ |

Category shown as colored pill badge using category.color.
Status: green "Active" / grey "Inactive" badge.
Actions: Edit (pencil icon) and Delete (trash icon) buttons.

**Add/Edit Product Modal:**

```
Title: "Add Product" / "Edit Product"
─────────────────────────────
Name *           [ _____________ ]
Category         [ Search or Select ▼ ]  [+ New Category]
Price (₹) *      [ _______ ]
Unit of Measure  [ per piece ▼ ]  options: per piece, per kg, per litre, per serving
Tax %            [ ___ ] %
Description      [ textarea ____________ ]
Show on KDS      [  ●──] toggle
─────────────────────────────
         [Cancel]  [Save Product]
```

"+ New Category" link inline next to category dropdown → opens a small mini-form inline below the dropdown:

```
Name [ _______ ]  Color [●] [●] [●] [●] [●] [●]  [Create]
```

On create: adds category to DB, selects it immediately in the product form.

Delete: ConfirmDialog "Delete [Product Name]? This will hide it from the POS. Orders with this product will be preserved." → Yes (soft delete) / Cancel.

### 12.5 Categories.jsx

Table: | Color swatch | Name | Actions |
Color swatch: 24×24 circle in `category.color`

Add/Edit Category Modal:

```
Name *         [ ___________ ]
Color *        Preset swatches (12 circles):
               🔴 🔵 🟠 🟡 🟢 🟣 🟤 ⚫ and 4 more
               + Custom hex: [ #______ ]
               Live preview circle

         [Cancel]  [Save Category]
```

### 12.6 PaymentMethods.jsx

Three large cards side by side:

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  💵 Cash         │  │  💳 Card/Digital  │  │  📱 UPI QR       │
│                 │  │                 │  │                 │
│  [  ●──] ON     │  │  [──●  ] OFF    │  │  [  ●──] ON     │
│                 │  │                 │  │                 │
│  Available at   │  │  Click to        │  │ UPI ID:         │
│  checkout       │  │  enable          │  │ [cafe@ybl    ]  │
│                 │  │                 │  │                 │
│                 │  │                 │  │  [QR Preview]   │
│                 │  │                 │  │  [Save UPI ID]  │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

For UPI: when enabled toggle is ON, show a text input for UPI ID + "Generate QR" button that calls `qrcode.react` with the UPI string immediately (client-side preview). Green glow (`shadow-[0_0_20px_#52B788]`) on enabled cards.

### 12.7 Floors.jsx

Two-panel layout:

```
┌──────────────────┬───────────────────────────────────┐
│  Floors          │  Tables — Ground Floor             │
│  [+ Add Floor]   │                          [+ Add]   │
│  ─────────────── │  ┌────┐ ┌────┐ ┌────┐            │
│ > Ground Floor   │  │ T1 │ │ T2 │ │ T3 │            │
│   First Floor    │  │ 4  │ │ 4  │ │ 6  │            │
│                  │  │seat│ │seat│ │seat│            │
│                  │  └────┘ └────┘ └────┘            │
└──────────────────┴───────────────────────────────────┘
```

Floor list left panel: clickable items, selected = `bg-[#52B788]/20 border-l-4 border-[#52B788]`
Table cards: show table number large, seat count small, Active/Inactive badge, ✏️🗑️ icons on hover.

Add Table modal: Table Number input, Seats number input (min 1), Is Active toggle.
Add Floor modal: just Name input.

### 12.8 Coupons.jsx

Table: Code, Type badge (Percentage=blue / Fixed=purple), Discount Value, Status, Created At, Actions

Add/Edit Coupon Modal:

```
Code *           [ SAVE10 ] (auto-uppercase as user types)
Discount Type *  (●) Percentage  ( ) Fixed Amount
Value *          [ 10 ] %   (or ₹ if fixed)
Active           [  ●──]
```

### 12.9 Promotions.jsx

Table: Name, Type (Product/Order badge), Trigger Condition, Discount, Status, Actions

Add/Edit Promotion Modal:

```
Name *           [ Buy 3 Get Discount ]
Type *           (●) Product Promotion  ( ) Order Promotion

-- If Product Promotion: --
Product *        [ Search product... ▼ ]
Min Quantity *   [ 3 ]  (applies when cart has ≥ 3 of this product)

-- If Order Promotion: --
Min Order Amount * [ ₹ 500 ]  (applies when cart total ≥ ₹500)

Discount Type *  (●) Percentage  ( ) Fixed Amount
Discount Value * [ 15 ] % (or ₹)
Active           [  ●──]
```

### 12.10 Users.jsx

Table: Name, Email, Role badge (Admin=green / Employee=amber), Status (Active/Archived), Created, Actions

Actions per row (icon buttons with tooltips):

- 🔑 Change Password → modal with `new_password` input
- 📁 Archive/Unarchive → toggle with confirmation
- 🗑️ Delete → ConfirmDialog "Are you sure? This cannot be undone."

Add User Modal:

```
Name *     [ _________ ]
Email *    [ _________ ]
Password * [ _________ ]
Role *     [ Admin ▼ ]  options: Admin, Employee
```

---

## 13. POS TERMINAL — ALL VIEWS IN COMPLETE DETAIL

### 13.1 POSNavbar.jsx

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ☕ Cafe POS  | [POS Order] [Orders] [Customer] [Table View]  [🔍 Search...]  │
│             |                                          [Table 3 🟢] [AB▼] [≡]│
└──────────────────────────────────────────────────────────────────────────────┘
```

- Logo + name: left-most
- Nav pill buttons: `bg-[#2D4A3E]` default, `bg-[#52B788]` when active route
- Search bar: text input with Search icon, width 200px, when focused expands to 280px
- Table indicator chip: `bg-[#52B788]/20 border border-[#52B788]` showing "Table X" (or "No Table"), click → opens FloorPopup
- Employee avatar: initials in circle `bg-[#2D6A4F]`, tooltip with full name
- Hamburger `≡`: opens dropdown menu

**Hamburger Dropdown (from right):**
Admin users see: Products, Categories, Payment Methods, Floors & Tables, Coupons, Promotions, Users, Reports (links to /backend/\* routes), divider, Close Session, Logout
Employee users see: Close Session, Logout only

Close Session → calls POST /api/sessions/close/:id → shows closing summary modal → redirect to /login

### 13.2 FloorPopup.jsx

Triggered automatically when:

1. Session opens and no table is selected
2. Employee clicks "Table View" in navbar or table indicator chip
3. `cartStore.selectedTable === null`

**Cannot be dismissed by Escape or clicking outside if no table is selected.**

```
┌─────────────────────────────────────────────────────┐
│  Select a Table                                     │
│  ─────────────────────────────────────────────────  │
│  [Ground Floor] [First Floor]  ← tabs               │
│                                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐               │
│  │  T1  │ │  T2  │ │  T3  │ │  T4  │               │
│  │ 4 💺 │ │ 4 💺 │ │ 6 💺 │ │ 4 💺 │               │
│  └──────┘ └──────┘ └──────┘ └──────┘               │
│  Available  In Use  Available  In Use               │
│                                                     │
│         [✕ Cancel] ← only visible if table already  │
│                       selected                      │
└─────────────────────────────────────────────────────┘
```

Available table: `bg-[#2D6A4F]` with beige text
Occupied table: `bg-[#D97706]/80` with dark text + "In Use" pill badge

Clicking available table → set `cartStore.selectedTable = table`, close popup, load/create order for table
Clicking occupied table → show inline confirmation "Table T2 has an active order. Continue editing?" [Yes] [No]
If Yes → load that order into cart
If No → stay on popup

### 13.3 POSMain.jsx — The Core Order Screen

**Three-column grid layout (CSS Grid: 40% 35% 25%):**

---

**COLUMN 1 — Products (40%)**

```
[ All ] [ 🔴 Hot Drinks ] [ 🔵 Cold Drinks ] [ 🟠 Snacks ]
← horizontal scroll if many categories →

[ 🔍 Search products... ]

┌────────────┐ ┌────────────┐ ┌────────────┐
│  ━━━━━━━━  │ │  ━━━━━━━━  │ │  ━━━━━━━━  │
│ (cat color)│ │ (cat color)│ │ (cat color)│
│            │ │            │ │            │
│  Espresso  │ │  Latte     │ │  Muffin    │
│  ₹80       │ │  ₹120      │ │  ₹80       │
│  per piece │ │  per piece │ │  per piece │
│       PROMO│ │            │ │            │
└────────────┘ └────────────┘ └────────────┘
```

Category tabs: horizontal scrollable, each tab uses `background: category.color` when active. All tab: `bg-[#2D6A4F]` when active.
Product cards: top color strip (4px) in category.color. Click = add to cart with quick ripple animation.
"PROMO" badge: small top-right label in `bg-amber-500` text-black if product has active promotion.

---

**COLUMN 2 — Cart (35%)**

```
Order #ORD-20240615-0001        [ Table 3 ]
Customer: Walk-in               [+ Assign Customer]
─────────────────────────────────────────────
[ - ] 2 [ + ]  Espresso                ₹160.00
               ₹80.00 each
               🏷️ Promo: −₹24.00
─────────────────────────────────────────────
[ - ] 1 [ + ]  Latte                   ₹120.00
               ₹120.00 each
─────────────────────────────────────────────
[ - ] 1 [ + ]  Sandwich                ₹120.00
               ₹120.00 each
─────────────────────────────────────────────
                          Subtotal:    ₹400.00
                          Tax:          ₹24.00
                          Promo Disc: −₹24.00
                          Coupon:        −₹0.00
                          ─────────────────────
                          TOTAL:       ₹400.00

[ 👤 Customer ] [ 🎫 Coupon ] [ 📤 Send to Kitchen ] [ ✉️ ]
```

Each cart item row:

- Minus button (grey circle), quantity display (editable number input inline), Plus button (green circle)
- Product name (left, white, bold) + unit price (grey, small, below name)
- Line total (right, bold, beige)
- Trash icon `×` far right (removes item)
- If item_discount > 0: green tag below product name: `🏷️ −₹XX.XX (Promo Name)`

Order Summary block (below items):

- Lines: Subtotal, Tax, each applied promotion (green), Coupon discount (green)
- Total: large font, bold, `#F0D9A0` color
- If no discount: discount lines are hidden (not shown as ₹0.00)

Action buttons row:

- `👤 Customer` → opens CustomerModal
- `🎫 Coupon` → opens DiscountPopup
- `📤 Send to Kitchen` (green, prominent, full-flex remaining) → POST /api/orders/:id/send-to-kds
- `✉️` icon only → opens EmailReceiptModal

---

**COLUMN 3 — Payment (25%)**

```
Payment
─────────────
Total: ₹400.00
─────────────

[ 💵 Cash        ]
[ 💳 Card/Digital]
[ 📱 UPI QR      ]

─────────────
(sub-panel expands based on selection)
```

**Cash sub-panel (when Cash selected):**

```
Amount Received (₹)
[ 500 ]

Change Due:
₹100.00

[✓ Confirm Payment]
```

Change updates in real-time as employee types amount received.
"Confirm Payment" disabled if amount < order.total.

**Card sub-panel (when Card selected):**

```
Card / Digital Payment

Total to charge: ₹400.00

[🔗 Open Polar Checkout]

(After opening checkout:)
Transaction Reference
[ __________ ]
[✓ Payment Done] [Cancel]

Or for demo:
[⚡ Simulate Payment (Dev)]
```

Polar Checkout flow:

1. Click "Open Polar Checkout" → POST /api/payments/polar/create-checkout → get checkout_url
2. Open checkout_url in new browser tab
3. Employee completes payment in that tab
4. On return, employee enters reference (optional) and clicks "Payment Done"
5. Frontend polls GET /api/orders/:id every 3 seconds to check if status changed to 'paid' (or receives it via socket)
6. On confirmation: show success state

**UPI sub-panel (when UPI selected):**

```
Scan to Pay

[  ████████████  ]
[  ████████████  ]  ← QR code image (300×300)
[  ████████████  ]

Amount: ₹400.00
cafe@ybl

[✓ Payment Confirmed]  [Cancel]
```

QR loaded from GET /api/payments/upi-qr?order_id=X
After customer scans and pays, employee clicks "Payment Confirmed" → POST /api/payments/upi/confirm

**After successful payment (any method):**
Replace payment column content with:

```
✅ Payment Successful!

Order #ORD-20240615-0001
₹400.00 received

[🖨️ Print Receipt]
[✉️ Email Receipt]
[➕ New Order]
```

"New Order" → clear cart, set selectedTable to null, open FloorPopup

### 13.4 DiscountPopup.jsx

```
┌──────────────────────────────────┐
│  Apply Coupon Code               │
│  ────────────────────────────    │
│  Enter your coupon code below    │
│                                  │
│  [ SAVE10          ]             │
│                                  │
│  ✅ ₹40.00 discount applied!     │
│     (Code: SAVE10 — 10% off)     │
│                                  │
│         [Cancel] [Apply Coupon]  │
└──────────────────────────────────┘
```

Input auto-converts to uppercase as user types.
On Apply: POST /api/coupons/validate → on success show green success block.
If coupon already applied: show "Remove Coupon" option.
Error state: red text "Invalid or expired coupon code."

### 13.5 CustomerModal.jsx

```
┌────────────────────────────────────────┐
│  Assign Customer                       │
│  ──────────────────────────────────    │
│  [ 🔍 Search by name, email, phone... ]│
│                                        │
│  Search results:                       │
│  ┌───────────────────────────────────┐ │
│  │ John Doe  |  9876543210  |  ✓    │ │
│  │ jane@cafe.com                     │ │
│  └───────────────────────────────────┘ │
│                                        │
│  ─── Create New Customer ───           │
│  Name     [ ________ ]                │
│  Email    [ ________ ]                │
│  Phone    [ ________ ]                │
│  [💾 Save & Assign]                   │
│                                        │
│                          [✕ Cancel]   │
└────────────────────────────────────────┘
```

Search is debounced 300ms, calls GET /api/customers?search=X.
Clicking an existing customer → assigns to order, closes modal.
Create & Assign → POST /api/customers → assign to order.
If customer already assigned: show `Currently: John Doe [× Remove]` at top of modal.

### 13.6 OrdersList.jsx

```
Orders — Session #3
────────────────────────────────────
[ 🔍 Search orders... ]  [All ▼] [Draft] [Paid] [Cancelled]

# | Order No.      | Time     | Customer | Table | Total    | Status |
──┼────────────────┼──────────┼──────────┼───────┼──────────┼────────┼
1 │ ORD-20240615-0001│ 10:30am│ John Doe │ T1    │ ₹400.00 │ ✅Paid │
2 │ ORD-20240615-0002│ 11:05am│ Walk-in  │ T3    │ ₹120.00 │ 🟡Draft│
3 │ ORD-20240615-0003│ 11:45am│ Jane     │ T2    │ ₹280.00 │ 🔴Canc │
```

Status badges: Draft = amber, Paid = green, Cancelled = red, sent_to_kds = blue
Clicking row → navigate to `/pos/orders/:id`

### 13.7 OrderDetail.jsx

```
← Back to Orders

Order #ORD-20240615-0001
Status: ✅ Paid          Date: 15 Jun 2024, 10:30 AM
Customer: John Doe        Table: T1
Employee: Admin User

Items:
─────────────────────────────────────────────
Product       Qty    Price    Discount    Total
Espresso      2      ₹80.00   ₹24.00    ₹136.00
Latte         1      ₹120.00  —         ₹120.00
Sandwich      1      ₹120.00  —         ₹120.00
─────────────────────────────────────────────
                    Subtotal:            ₹400.00
                    Tax (5%+12%):         ₹24.00
                    Promotion:          −₹24.00
                    ─────────────────────────────
                    TOTAL:              ₹400.00

[🖨️ Print Receipt]  [✉️ Email Receipt]
```

For Draft orders add buttons: `[🗑️ Cancel Order]` (with confirm dialog) + `[✏️ Edit Order]` (loads order into cart, redirects to /pos)

### 13.8 TableView.jsx (Full Page)

Same visual as FloorPopup but as a full page (not modal).
Floor tabs at top. Table grid below.
Click occupied table → loads that order into cart, navigates to /pos
Click empty table → creates new order context for that table, navigates to /pos

### 13.9 Customers.jsx (POS)

Search bar at top. Customer table:
| Name | Email | Phone | Actions |

Actions: ✏️ Edit (inline row edit or modal) + 🗑️ Delete (with confirm)
"+ Add Customer" button → opens add modal same as CustomerModal's create section.

---

## 14. KITCHEN DISPLAY SYSTEM — COMPLETE DETAIL

URL: `/kds` — NO authentication required. Designed for a dedicated kitchen screen.

### KDS Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  🍳 Kitchen Display   ●Connected        12:34:56 PM                  │
│  [ 🔍 Search... ]  [ Category ▼ ]  [ All | To Cook | Preparing ]    │
└──────────────────────────────────────────────────────────────────────┘
│                                                                       │
│  ┌───────────────┐   ┌───────────────┐   ┌───────────────┐          │
│  │ #ORD-...0001  │   │ #ORD-...0002  │   │ #ORD-...0003  │          │
│  │ 🔴 To Cook    │   │ 🟡 Preparing  │   │ 🟢 Completed  │          │
│  │ 5 min ago     │   │ 2 min ago     │   │ 8 min ago     │          │
│  │ ───────────   │   │ ───────────   │   │ ───────────   │          │
│  │ ○ Espresso ×2 │   │ ✅ ~~Latte~~  │   │ ✅ ~~Sand...~~│          │
│  │ ○ Sandwich ×1 │   │ ○ Muffin  ×2 │   │ ✅ ~~Muffin~~ │          │
│  │ ───────────   │   │ ───────────   │   │ ───────────   │          │
│  │[▶ Start Prep] │   │[✓ Complete]   │   │ ✓ Done        │          │
│  └───────────────┘   └───────────────┘   └───────────────┘          │
└──────────────────────────────────────────────────────────────────────┘
```

**KDS Navbar:**

- "🍳 Kitchen Display" title left
- Pulsing green dot + "Connected" (or red + "Reconnecting..." on disconnect)
- Live digital clock right side (updates every second)

**Filter bar below navbar:**

- Search input: filters by product_name across all visible tickets
- Category dropdown: filter by category
- Stage pills: [All] [To Cook] [Preparing] — click to filter

**Ticket Cards (grid, 3-4 columns, responsive):**
Each card `bg-[#132A1E] border-[#2D4A3E] rounded-xl p-4`:

- **Header**: `Order #ORD-XXXXXXXXX` bold + stage badge top-right
  - To Cook badge: `bg-red-700 text-white`
  - Preparing badge: `bg-amber-600 text-white`
  - Completed badge: `bg-green-700 text-white`
- **Time elapsed**: "X min ago" — computed in real-time, updates every 30s. If > 10 min: color turns orange. If > 20 min: turns red (urgency indicator)
- **Items list**: Each item row:
  - Empty circle `○` on left (click = toggle individual completion)
  - Product name + `×N` quantity in a small bubble
  - When toggled: circle becomes `✅`, product name gets `line-through text-[#6B8F71]` strikethrough
  - Click calls PUT /api/kds/items/:kds_item_id/complete
- **Footer button** (full width):
  - If To Cook: amber button `▶ Start Preparing` → advances to 'preparing'
  - If Preparing: green button `✓ Mark Complete` → advances to 'completed'
  - If Completed: muted disabled `✓ Done`
  - Calls PUT /api/kds/tickets/:id/stage

**Real-time behavior:**

- `useSocket()` hook connects to backend Socket.io on mount
- `socket.emit('join:kds')` on connect
- `kds:new_order` → prepend new ticket, animate with CSS `@keyframes slideInLeft`
- `kds:stage_updated` → update matching ticket's stage badge + footer button in-place
- `kds:item_updated` → toggle strikethrough on matching item row

**Completed ticket auto-hide:**

- When a ticket advances to 'completed': start a 60-second countdown timer
- Show fading countdown in the "✓ Done" area: "Hiding in 45s"
- After 60s: remove ticket from DOM with fade-out animation
- "Show Completed" toggle button in filter bar shows all completed tickets permanently

**New ticket notification:**

- When `kds:new_order` fires: flash page title "🔔 New Order!" for 3 seconds
- Play a subtle notification sound (short beep using Web Audio API or an `<audio>` element)

---

## 15. CART STATE MANAGEMENT (cartStore.js — Zustand)

```javascript
// store/cartStore.js
const useCartStore = create((set, get) => ({
  // State
  items: [], // [{ product_id, product_name, quantity, unit_price, tax_percentage, category_color, item_discount, line_total }]
  selectedTable: null, // { id, table_number, floor_id }
  activeOrderId: null, // null if new order, number if editing existing
  activeOrderNumber: null,
  customer: null, // { id, name, email, phone } or null
  couponCode: null,
  couponDiscount: 0,
  promotionDiscounts: {}, // { product_id: { amount, name } }
  orderPromoDiscount: 0,
  orderPromoName: null,

  // Computed (derived)
  get subtotal() {
    return get().items.reduce((s, i) => s + i.unit_price * i.quantity, 0);
  },
  get taxAmount() {
    return get().items.reduce(
      (s, i) => s + i.unit_price * i.quantity * (i.tax_percentage / 100),
      0,
    );
  },
  get totalItemDiscounts() {
    return Object.values(get().promotionDiscounts).reduce(
      (s, d) => s + d.amount,
      0,
    );
  },
  get discountAmount() {
    return (
      get().totalItemDiscounts + get().orderPromoDiscount + get().couponDiscount
    );
  },
  get total() {
    return get().subtotal + get().taxAmount - get().discountAmount;
  },

  // Actions
  addItem: (product) => {
    /* increment qty if exists, else push */
  },
  removeItem: (product_id) => {
    /* remove from items */
  },
  updateQuantity: (product_id, qty) => {
    /* set qty, remove if 0 */
  },
  setTable: (table) => set({ selectedTable: table }),
  setCustomer: (customer) => set({ customer }),
  applyCoupon: (code, discountAmount) =>
    set({ couponCode: code, couponDiscount: discountAmount }),
  removeCoupon: () => set({ couponCode: null, couponDiscount: 0 }),
  applyPromotions: (promotionResult) =>
    set({
      promotionDiscounts: Object.fromEntries(
        promotionResult.item_discounts.map((d) => [
          d.product_id,
          { amount: d.discount_amount, name: d.promotion_name },
        ]),
      ),
      orderPromoDiscount: promotionResult.order_discount,
      orderPromoName: promotionResult.order_promotion_name,
    }),
  loadOrder: (order) => {
    /* populate cart from existing order object */
  },
  clearCart: () =>
    set({
      items: [],
      activeOrderId: null,
      activeOrderNumber: null,
      customer: null,
      couponCode: null,
      couponDiscount: 0,
      promotionDiscounts: {},
      orderPromoDiscount: 0,
    }),

  // Persist to localStorage
  persist: () => localStorage.setItem("pos_cart", JSON.stringify(get())),
  restore: () => {
    const saved = localStorage.getItem("pos_cart");
    if (saved) set(JSON.parse(saved));
  },
}));
```

**Every time `items` changes:**

1. Persist cart to localStorage
2. Call POST /api/promotions/calculate (debounced 500ms) with current items + subtotal
3. Call `applyPromotions(result)` to update discount state

---

## 16. PROMOTION CALCULATION — COMPLETE BUSINESS RULES

1. **Product Promotion trigger**: `promotion.product_id === item.product_id AND item.quantity >= promotion.min_quantity`
   - Discount applies to the entire line of that product
   - If percentage: `discount = item.unit_price * item.quantity * (rate/100)`
   - If fixed: `discount = min(discount_value, item.unit_price * item.quantity)`

2. **Order Promotion trigger**: `subtotal >= promotion.min_order_amount`
   - If multiple order promotions qualify: only apply the ONE with the highest discount_amount
   - If percentage: `discount = subtotal * (rate/100)`
   - If fixed: `discount = min(discount_value, subtotal)`

3. **Stacking**: Product promotions + order promotions CAN coexist. Two order promotions do NOT stack.

4. **Coupon**: Applies on top of promotion discounts. Only one coupon at a time. Applied AFTER promotions.

5. **Display**: In cart, each product with a promotion shows a green tag. In order summary, each promotion appears as a named line item.

6. **Server verification**: On `POST /api/orders` and `PUT /api/orders/:id`, the backend re-runs the same calculation and ignores client-side discount values.

---

## 17. POLAR PAYMENT INTEGRATION

Polar.sh (https://polar.sh) sandbox for card/digital payments.

**Setup steps:**

1. Create account on https://polar.sh
2. Go to Settings → API → Create access token (sandbox/test mode)
3. Create a "product" in Polar for "POS Payment" with a flexible price
4. Note the `product_price_id`
5. Set up webhook endpoint pointing to `your_domain/api/payments/polar/webhook`

**polar.service.js:**

```javascript
const POLAR_API = "https://sandbox-api.polar.sh/api";

const createCheckout = async (order) => {
  const res = await fetch(`${POLAR_API}/v1/checkouts/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_price_id: process.env.POLAR_PRODUCT_PRICE_ID,
      success_url: `${process.env.FRONTEND_URL}/pos?payment_status=success&order_id=${order.id}`,
      metadata: {
        order_id: String(order.id),
        order_number: order.order_number,
      },
    }),
  });
  if (!res.ok) throw new Error(`Polar API error: ${res.status}`);
  const data = await res.json();
  return { checkout_url: data.url, polar_checkout_id: data.id };
};

const verifyWebhookSignature = (payload, signature, secret) => {
  // Use crypto.createHmac to verify the webhook signature per Polar docs
};
```

**Note on local dev**: Use ngrok or similar to expose `localhost:5000` so Polar webhooks can reach it. Alternatively, the `POST /api/payments/polar/simulate` endpoint bypasses the webhook for dev demo.

---

## 18. PRINT RECEIPT FUNCTIONALITY

**PrintableReceipt.jsx** — a hidden component rendered in DOM:

```jsx
// Hidden div with print-only CSS
<div id="printable-receipt" style={{ display: "none" }}>
  // 80mm thermal paper format // Cafe name + address header // Order details //
  Items table // Totals // Payment method // Thank you footer
</div>
```

**Print CSS (in index.css or a separate print.css):**

```css
@media print {
  body > *:not(#printable-receipt) {
    display: none !important;
  }
  #printable-receipt {
    display: block !important;
    width: 80mm;
    font-size: 11px;
  }
}
```

Trigger with: `document.getElementById('printable-receipt').style.display = 'block'; window.print();`

---

## 19. EXPORT UTILITIES

### exportPDF.js

```javascript
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportReportPDF = (data, period) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(45, 106, 79);
  doc.text("Odoo Cafe POS — Sales Report", 14, 20);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Period: ${period}`, 14, 28);
  doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, 14, 34);

  // Summary
  doc.setFontSize(14);
  doc.text("Summary", 14, 44);
  autoTable(doc, {
    startY: 48,
    head: [["Metric", "Value"]],
    body: [
      ["Total Orders", data.summary.total_orders],
      ["Revenue", `₹${data.summary.revenue.toFixed(2)}`],
      ["Avg Order Value", `₹${data.summary.average_order_value.toFixed(2)}`],
    ],
    theme: "grid",
    headStyles: { fillColor: [45, 106, 79] },
  });

  // Top Products table
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Product", "Qty Sold", "Revenue"]],
    body: data.top_products.map((p) => [
      p.product_name,
      p.quantity_sold,
      `₹${p.revenue.toFixed(2)}`,
    ]),
    headStyles: { fillColor: [45, 106, 79] },
  });

  doc.save(`cafe-report-${Date.now()}.pdf`);
};
```

### exportXLS.js

```javascript
import * as XLSX from "xlsx";

export const exportReportXLS = (data, period) => {
  const wb = XLSX.utils.book_new();

  // Summary sheet
  const summaryData = [
    ["Odoo Cafe POS — Sales Report"],
    [`Period: ${period}`],
    [],
    ["Total Orders", data.summary.total_orders],
    ["Revenue", `₹${data.summary.revenue.toFixed(2)}`],
    ["Avg Order Value", `₹${data.summary.average_order_value.toFixed(2)}`],
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(summaryData),
    "Summary",
  );

  // Top Products sheet
  const productsHeaders = [["Product", "Qty Sold", "Revenue"]];
  const productsData = data.top_products.map((p) => [
    p.product_name,
    p.quantity_sold,
    p.revenue,
  ]);
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([...productsHeaders, ...productsData]),
    "Top Products",
  );

  // Top Categories sheet
  const catHeaders = [["Category", "Revenue", "% of Total"]];
  const catData = data.top_categories_table.map((c) => [
    c.category_name,
    c.revenue,
    c.percentage_of_total + "%",
  ]);
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([...catHeaders, ...catData]),
    "Top Categories",
  );

  // Top Orders sheet
  const ordersHeaders = [["Order #", "Customer", "Table", "Total", "Date"]];
  const ordersData = data.top_orders.map((o) => [
    o.order_number,
    o.customer_name || "Walk-in",
    o.table_number || "Takeaway",
    o.total,
    o.created_at,
  ]);
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([...ordersHeaders, ...ordersData]),
    "Top Orders",
  );

  XLSX.writeFile(wb, `cafe-report-${Date.now()}.xlsx`);
};
```

---

## 20. SEED DATA (backend/src/config/seed.js)

Run with `npm run seed`. Insert all of the following:

```javascript
// Users
{ name: 'Admin User',     email: 'admin@odoocafe.com',    password: 'Admin@123',    role: 'admin' }
{ name: 'John Cashier',   email: 'employee@odoocafe.com', password: 'Employee@123', role: 'employee' }

// Categories
{ name: 'Hot Drinks',  color: '#C0392B' }
{ name: 'Cold Drinks', color: '#2980B9' }
{ name: 'Snacks',      color: '#E67E22' }

// Products
{ name: 'Espresso',     category: 'Hot Drinks',  price: 80,  tax: 5,  uom: 'per piece', kds: true }
{ name: 'Latte',        category: 'Hot Drinks',  price: 120, tax: 5,  uom: 'per piece', kds: true }
{ name: 'Cappuccino',   category: 'Hot Drinks',  price: 130, tax: 5,  uom: 'per piece', kds: true }
{ name: 'Cold Coffee',  category: 'Cold Drinks', price: 150, tax: 5,  uom: 'per piece', kds: true }
{ name: 'Lemonade',     category: 'Cold Drinks', price: 90,  tax: 5,  uom: 'per litre', kds: false }
{ name: 'Sandwich',     category: 'Snacks',      price: 120, tax: 12, uom: 'per piece', kds: true }
{ name: 'Blueberry Muffin', category: 'Snacks', price: 80,  tax: 12, uom: 'per piece', kds: true }
{ name: 'Pasta',        category: 'Snacks',      price: 180, tax: 12, uom: 'per serving',kds: true }

// Floors & Tables
Floor: 'Ground Floor'  → Tables: T1 (4 seats), T2 (4 seats), T3 (6 seats)
Floor: 'First Floor'   → Tables: T4 (6 seats), T5 (4 seats)

// Payment Methods (update existing rows)
cash: is_enabled = true
card: is_enabled = true
upi:  is_enabled = true, upi_id = 'cafe@ybl'

// Coupon
{ code: 'SAVE10', discount_type: 'percentage', discount_value: 10, is_active: true }

// Promotions
{ name: 'Espresso Triple Deal', type: 'product', product: 'Espresso', min_qty: 3, discount_type: 'percentage', discount_value: 15 }
{ name: 'Big Order Discount',   type: 'order', min_order_amount: 500, discount_type: 'fixed', discount_value: 50 }
```

---

## 21. SESSION MANAGEMENT FLOW

**On POS page load:**

1. Call GET /api/sessions/active
2. If open session exists → store in sessionStore, show Floor popup
3. If no session → show "Start Session" overlay:
   ```
   ┌───────────────────────────────────┐
   │  Welcome back, John               │
   │                                   │
   │  Last session: 14 Jun 2024        │
   │  Closing sale: ₹12,450.00         │
   │                                   │
   │  [▶ Open New POS Session]         │
   └───────────────────────────────────┘
   ```
4. Click Open Session → POST /api/sessions/open → store session → show Floor popup

**Close Session (from hamburger menu):**

1. Show summary modal: "Close Session? Total orders today: 24, Revenue: ₹8,450"
2. [Confirm Close] → POST /api/sessions/close/:id
3. Show closing report modal with summary
4. [Done] → navigate to /login

---

## 22. COMPLETE BUSINESS LOGIC RULES

1. **Table-Order Uniqueness**: One table can have only ONE active order (status = draft or sent_to_kds). Enforce on backend: before creating order for a table, check no active order exists.

2. **Price Snapshots**: When adding items to an order, capture `product_name` and `unit_price` at that moment in `order_items`. Never reference current product price for historical orders.

3. **Tax per item**: Tax is calculated per line: `tax_amount_for_line = unit_price * quantity * (tax_percentage/100)`. Sum all line taxes for `orders.tax_amount`.

4. **Soft delete products**: `is_active = false` hides from POS but keeps order history. Products with orders cannot be hard deleted.

5. **KDS-only items**: Only products with `show_on_kds = true` appear on the Kitchen Display. The POS employee can still add non-KDS products to orders; they just don't appear on KDS.

6. **Order status flow**: `draft → sent_to_kds → paid`. Cancelled can be reached from draft or sent_to_kds. Once paid, order is immutable.

7. **Coupon case-insensitivity**: Normalize all coupon codes to uppercase before DB lookup and storage.

8. **One coupon per order**: Each order can have at most one coupon applied. Applying a new coupon replaces the previous one.

9. **Archived users**: `is_active = false` prevents login. They still appear in historical order data. API GET /api/users returns all users including archived (show archived badge).

10. **Employee vs Admin in POS**: Both roles can access all POS terminal pages. Only admin sees backend pages. Admin's hamburger menu shows links to all backend pages; employee only sees Close Session + Logout.

11. **Category color propagation**: Category color is stored in DB. All UIs (product cards, filter tabs, order items, KDS, reports) fetch category data fresh and apply the color. Changing color in admin instantly reflects everywhere after next render/refresh.

12. **Receipt print format**: 80mm wide thermal paper format. Font size 11px. No margins. Header, items list, totals, payment method, QR code for UPI orders.

13. **Walk-in orders**: `customer_id` is nullable. If no customer assigned, display as "Walk-in" everywhere.

14. **Takeaway orders**: `table_id` is nullable. Allow creating orders without a table for takeaway scenarios.

---

## 23. SECURITY REQUIREMENTS

1. Never return `password_hash` in any API response (SELECT specific fields, never SELECT \*)
2. All routes except `/api/auth/*`, `/api/kds/*`, and `/api/payments/polar/webhook` require valid JWT
3. Use parameterized queries (`?` placeholders with mysql2) exclusively — never string-concatenate SQL
4. Rate limit: 200 requests per 15 minutes per IP
5. CORS: allow only `process.env.FRONTEND_URL` origin
6. Helmet.js for security headers
7. Password minimum 8 characters with at least one uppercase and one number
8. Store JWT in localStorage (acceptable for hackathon; note httpOnly cookies are more secure)
9. JWT expires in 7 days
10. All order totals and discounts re-calculated on backend — never trust client-submitted totals

---

## 24. UI/UX MICRO-INTERACTIONS (implement all)

1. **Add to cart animation**: brief scale-up + fade animation on product card click
2. **Cart quantity change**: smooth height animation when items are added/removed
3. **Toast notifications**: success (green), error (red), info (blue) using react-hot-toast
4. **Page transitions**: subtle fade-in on route changes
5. **Loading skeletons**: animated grey shimmer blocks while data loads (use Tailwind `animate-pulse`)
6. **Empty states**: illustrated empty state with helpful action CTA on every empty list
7. **KDS new order**: slide-in from left animation with a subtle glow border for 2 seconds
8. **KDS item strikethrough**: CSS transition on text-decoration
9. **Payment success**: confetti burst or checkmark animation using CSS keyframes
10. **Table status badge**: color transitions smoothly when status changes via socket

---

## 25. PACKAGE.JSON SCRIPTS

### Backend:

```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "seed": "node src/config/seed.js"
  }
}
```

### Frontend:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Root (optional concurrently):

```json
{
  "scripts": {
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm run dev\""
  }
}
```

---

## 26. README.md MUST INCLUDE

```markdown
# Odoo Cafe POS

## Prerequisites

- Node.js v20+
- MySQL 8+
- npm

## Setup

### 1. Clone and install

cd backend && npm install
cd ../frontend && npm install

### 2. Database

mysql -u root -p < backend/src/config/schema.sql

### 3. Environment

cp backend/.env.example backend/.env

# Fill in DB credentials, JWT secret, email, Polar keys

### 4. Seed data

cd backend && npm run seed

### 5. Run

# Terminal 1 (backend):

cd backend && npm run dev

# Terminal 2 (frontend):

cd frontend && npm run dev

## Access

- Admin panel: http://localhost:5173/login
  - Email: admin@odoocafe.com | Password: Admin@123
- Employee: employee@odoocafe.com | Password: Employee@123
- Kitchen Display: http://localhost:5173/kds (no login needed)

## Polar Payment Setup

1. Create account at https://polar.sh (use sandbox mode)
2. Create API access token in Settings → API
3. Create a flexible-price product for POS payments
4. Copy product_price_id to .env
5. Set webhook URL: your_url/api/payments/polar/webhook
6. For local dev: use ngrok to expose port 5000

## Tech Stack

React + Vite | Node.js + Express | MySQL | Socket.io | Polar.sh
```

---

## FINAL CHECKLIST — EVERY ITEM MUST BE WORKING

- [ ] Signup and Login with JWT (admin and employee roles)
- [ ] Admin backend with sidebar navigation
- [ ] Product CRUD with category color display
- [ ] Category CRUD with color picker
- [ ] Payment method toggles + UPI ID save
- [ ] Floor and Table management (CRUD)
- [ ] Coupon CRUD + validation endpoint
- [ ] Promotion CRUD (product and order types)
- [ ] User/Employee management (CRUD, archive, password change)
- [ ] POS session open/close with summary
- [ ] Floor popup on session open
- [ ] Table selection with active order detection
- [ ] Product grid with category filter tabs and search
- [ ] Cart (add, remove, quantity update)
- [ ] Auto-promotion calculation (product and order types)
- [ ] Coupon code popup and application
- [ ] Customer search, create, and assign to order
- [ ] Send to Kitchen (creates KDS ticket, emits socket event)
- [ ] Cash payment with change calculation
- [ ] Polar card payment with checkout redirect
- [ ] UPI QR code generation and display
- [ ] UPI manual confirmation
- [ ] Payment success state with print/email options
- [ ] Email receipt via Nodemailer
- [ ] Print receipt (window.print() with 80mm CSS)
- [ ] Orders list with search and status filter
- [ ] Order detail view (view-only for paid, editable for draft)
- [ ] Edit and cancel draft orders
- [ ] KDS page with real-time ticket display (no auth)
- [ ] KDS stage advancement (To Cook → Preparing → Completed)
- [ ] KDS individual item completion (strikethrough)
- [ ] KDS socket.io real-time updates (new order, stage change, item toggle)
- [ ] KDS filter by product/category/stage + search
- [ ] KDS completed ticket auto-hide after 60s
- [ ] Dashboard with period/employee/session/product filters
- [ ] Dashboard summary metrics
- [ ] Sales trend chart (Recharts AreaChart)
- [ ] Top categories chart (PieChart)
- [ ] Top orders, top products, top categories tables
- [ ] Export to PDF (jsPDF + autoTable)
- [ ] Export to XLS (SheetJS)
- [ ] Seed data script
- [ ] Complete dark green + beige color theme throughout
- [ ] All empty states with helpful messages
- [ ] All loading states with skeletons or spinners
- [ ] Toast notifications for success/error on all actions
- [ ] Responsive layout (desktop-first, tablet-friendly)
- [ ] Cart persistence in localStorage
- [ ] Socket.io auto-reconnect on disconnect

---

_Build every single item in this checklist. This is a complete, submission-ready hackathon project._
