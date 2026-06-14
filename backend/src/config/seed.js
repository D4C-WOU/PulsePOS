require("dotenv").config();
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const pool = require("./db");

async function seed() {
  console.log("Starting database seeding...");
  const connection = await pool.getConnection();
  try {
    // Execute DDL from schema.sql first
    console.log("Applying database schema DDL...");
    const schemaPath = path.join(__dirname, "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");

    // Strip comments and split queries by semicolon
    const cleanSql = schemaSql.replace(/--.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
    const queries = cleanSql
      .split(";")
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    for (const query of queries) {
      if (query.toLowerCase().startsWith("create database")) {
        // Skip database creation if already connected, or handle it
        continue;
      }
      try {
        await connection.query(query);
      } catch (err) {
        // Ignore "USE" database warnings if any
        if (!query.toLowerCase().startsWith("use")) {
          console.warn(`DDL Warning: ${err.message} for query: ${query.slice(0, 80)}`);
        }
      }
    }

    await connection.beginTransaction();

    // 1. Seed Users
    console.log("Seeding users...");
    const users = [
      { name: "Admin User", email: "admin@odoocafe.com", password: "Admin@123", role: "admin" },
      { name: "John Cashier", email: "employee@odoocafe.com", password: "Employee@123", role: "employee" }
    ];

    for (const u of users) {
      const passwordHash = await bcrypt.hash(u.password, 12);
      await connection.query(
        `INSERT INTO users (name, email, password_hash, role, is_active)
         VALUES (?, ?, ?, ?, TRUE)
         ON DUPLICATE KEY UPDATE name=VALUES(name), password_hash=VALUES(password_hash), role=VALUES(role)`,
        [u.name, u.email, passwordHash, u.role]
      );
    }

    // 2. Seed Categories
    console.log("Seeding categories...");
    const categories = [
      { name: "Hot Drinks", color: "#C0392B" },
      { name: "Cold Drinks", color: "#2980B9" },
      { name: "Snacks", color: "#E67E22" }
    ];

    const categoryIds = {};
    for (const c of categories) {
      await connection.query(
        `INSERT INTO categories (name, color)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE color=VALUES(color)`,
        [c.name, c.color]
      );
      
      const [rows] = await connection.query("SELECT id FROM categories WHERE name = ?", [c.name]);
      categoryIds[c.name] = rows[0].id;
    }

    // 3. Seed Products
    console.log("Seeding products...");
    const products = [
      { name: "Espresso", category: "Hot Drinks", price: 80, tax: 5, uom: "per piece", kds: true },
      { name: "Latte", category: "Hot Drinks", price: 120, tax: 5, uom: "per piece", kds: true },
      { name: "Cappuccino", category: "Hot Drinks", price: 130, tax: 5, uom: "per piece", kds: true },
      { name: "Cold Coffee", category: "Cold Drinks", price: 150, tax: 5, uom: "per piece", kds: true },
      { name: "Lemonade", category: "Cold Drinks", price: 90, tax: 5, uom: "per litre", kds: false },
      { name: "Sandwich", category: "Snacks", price: 120, tax: 12, uom: "per piece", kds: true },
      { name: "Blueberry Muffin", category: "Snacks", price: 80, tax: 12, uom: "per piece", kds: true },
      { name: "Pasta", category: "Snacks", price: 180, tax: 12, uom: "per serving", kds: true }
    ];

    const productIds = {};
    for (const p of products) {
      const catId = categoryIds[p.category];
      await connection.query(
        `INSERT INTO products (name, category_id, price, unit_of_measure, tax_percentage, show_on_kds, is_active)
         VALUES (?, ?, ?, ?, ?, ?, TRUE)
         ON DUPLICATE KEY UPDATE category_id=VALUES(category_id), price=VALUES(price), unit_of_measure=VALUES(unit_of_measure), tax_percentage=VALUES(tax_percentage), show_on_kds=VALUES(show_on_kds)`,
        [p.name, catId, p.price, p.uom, p.tax, p.kds]
      );

      const [rows] = await connection.query("SELECT id FROM products WHERE name = ?", [p.name]);
      productIds[p.name] = rows[0].id;
    }

    // 4. Seed Floors & Tables
    console.log("Seeding floors & tables...");
    const floorTables = [
      {
        floor: "Ground Floor",
        tables: [
          { number: "T1", seats: 4 },
          { number: "T2", seats: 4 },
          { number: "T3", seats: 6 }
        ]
      },
      {
        floor: "First Floor",
        tables: [
          { number: "T4", seats: 6 },
          { number: "T5", seats: 4 }
        ]
      }
    ];

    for (const ft of floorTables) {
      await connection.query(
        `INSERT INTO floors (name)
         VALUES (?)
         ON DUPLICATE KEY UPDATE name=VALUES(name)`,
        [ft.floor]
      );

      const [fRows] = await connection.query("SELECT id FROM floors WHERE name = ?", [ft.floor]);
      const floorId = fRows[0].id;

      for (const t of ft.tables) {
        await connection.query(
          `INSERT INTO \`tables\` (floor_id, table_number, seats, is_active)
           VALUES (?, ?, ?, TRUE)
           ON DUPLICATE KEY UPDATE seats=VALUES(seats), is_active=VALUES(is_active)`,
          [floorId, t.number, t.seats]
        );
      }
    }

    // 5. Seed Payment Methods
    console.log("Seeding payment methods...");
    await connection.query(
      `INSERT INTO payment_methods (type, is_enabled, upi_id)
       VALUES ('cash', TRUE, NULL)
       ON DUPLICATE KEY UPDATE is_enabled=TRUE`
    );
    await connection.query(
      `INSERT INTO payment_methods (type, is_enabled, upi_id)
       VALUES ('card', TRUE, NULL)
       ON DUPLICATE KEY UPDATE is_enabled=TRUE`
    );
    await connection.query(
      `INSERT INTO payment_methods (type, is_enabled, upi_id)
       VALUES ('upi', TRUE, 'cafe@ybl')
       ON DUPLICATE KEY UPDATE is_enabled=TRUE, upi_id='cafe@ybl'`
    );

    // 6. Seed Coupons
    console.log("Seeding coupons...");
    await connection.query(
      `INSERT INTO coupons (code, discount_type, discount_value, is_active)
       VALUES ('SAVE10', 'percentage', 10.00, TRUE)
       ON DUPLICATE KEY UPDATE discount_type=VALUES(discount_type), discount_value=VALUES(discount_value), is_active=VALUES(is_active)`
    );

    // 7. Seed Promotions
    console.log("Seeding promotions...");
    // Product promotion: Espresso Triple Deal
    const espressoId = productIds["Espresso"];
    if (espressoId) {
      await connection.query(
        `INSERT INTO promotions (name, promotion_type, product_id, min_quantity, discount_type, discount_value, is_active)
         VALUES ('Espresso Triple Deal', 'product', ?, 3, 'percentage', 15.00, TRUE)
         ON DUPLICATE KEY UPDATE product_id=VALUES(product_id), min_quantity=VALUES(min_quantity), discount_type=VALUES(discount_type), discount_value=VALUES(discount_value), is_active=VALUES(is_active)`,
        [espressoId]
      );
    }

    // Order promotion: Big Order Discount
    await connection.query(
      `INSERT INTO promotions (name, promotion_type, min_order_amount, discount_type, discount_value, is_active)
       VALUES ('Big Order Discount', 'order', 500.00, 'fixed', 50.00, TRUE)
       ON DUPLICATE KEY UPDATE min_order_amount=VALUES(min_order_amount), discount_type=VALUES(discount_type), discount_value=VALUES(discount_value), is_active=VALUES(is_active)`
    );

    await connection.commit();
    console.log("Database seeded successfully!");
  } catch (error) {
    await connection.rollback();
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    connection.release();
    pool.end();
  }
}

seed();
