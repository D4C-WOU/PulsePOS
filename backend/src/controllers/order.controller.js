const { validationResult } = require("express-validator");
const pool = require("../config/db");
const promotionService = require("../services/promotion.service");
const emailService = require("../services/email.service");

// Helper to format date in YYYYMMDD
const getFormattedDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

const getOrders = async (req, res, next) => {
  try {
    const { session_id, status, search, customer_id, page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    let query = `
      SELECT o.*,
             c.name AS customer_name, c.email AS customer_email, c.phone AS customer_phone,
             t.table_number, t.seats AS table_seats,
             u.name AS employee_name
      FROM orders o
      LEFT JOIN customers c ON c.id = o.customer_id
      LEFT JOIN \`tables\` t ON t.id = o.table_id
      JOIN users u ON u.id = o.employee_id
      WHERE 1=1
    `;
    const params = [];

    if (session_id) {
      query += " AND o.session_id = ?";
      params.push(session_id);
    }
    if (status) {
      query += " AND o.status = ?";
      params.push(status);
    }
    if (customer_id) {
      query += " AND o.customer_id = ?";
      params.push(customer_id);
    }
    if (search) {
      query += " AND (o.order_number LIKE ? OR c.name LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    query += " ORDER BY o.created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit, 10), offset);

    const [rows] = await pool.query(query, params);

    const formatted = rows.map((r) => ({
      id: r.id,
      order_number: r.order_number,
      session_id: r.session_id,
      status: r.status,
      subtotal: parseFloat(r.subtotal),
      tax_amount: parseFloat(r.tax_amount),
      discount_amount: parseFloat(r.discount_amount),
      total: parseFloat(r.total),
      coupon_code: r.coupon_code,
      notes: r.notes,
      created_at: r.created_at,
      paid_at: r.paid_at,
      customer: r.customer_id
        ? {
            id: r.customer_id,
            name: r.customer_name,
            email: r.customer_email,
            phone: r.customer_phone,
          }
        : null,
      table: r.table_id
        ? {
            id: r.table_id,
            table_number: r.table_number,
            seats: r.table_seats,
          }
        : null,
      employee: {
        id: r.employee_id,
        name: r.employee_name,
      },
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT o.*,
             c.name AS customer_name, c.email AS customer_email, c.phone AS customer_phone,
             t.table_number, t.seats AS table_seats,
             u.name AS employee_name
      FROM orders o
      LEFT JOIN customers c ON c.id = o.customer_id
      LEFT JOIN \`tables\` t ON t.id = o.table_id
      JOIN users u ON u.id = o.employee_id
      WHERE o.id = ?
    `;

    const [rows] = await pool.query(query, [id]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const o = rows[0];

    // Fetch order items
    const [itemRows] = await pool.query(
      `SELECT oi.*, p.show_on_kds, cat.color AS category_color
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       LEFT JOIN categories cat ON cat.id = p.category_id
       WHERE oi.order_id = ?`,
      [id]
    );

    // Fetch payment record
    const [paymentRows] = await pool.query(
      "SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC LIMIT 1",
      [id]
    );

    const formattedItems = itemRows.map(i => ({
      id: i.id,
      product_id: i.product_id,
      product_name: i.product_name,
      quantity: i.quantity,
      unit_price: parseFloat(i.unit_price),
      tax_percentage: parseFloat(i.tax_percentage),
      item_discount: parseFloat(i.item_discount),
      line_total: parseFloat(i.line_total),
      kds_status: i.kds_status,
      category_color: i.category_color || "#52B788",
    }));

    const formattedOrder = {
      id: o.id,
      order_number: o.order_number,
      session_id: o.session_id,
      status: o.status,
      subtotal: parseFloat(o.subtotal),
      tax_amount: parseFloat(o.tax_amount),
      discount_amount: parseFloat(o.discount_amount),
      total: parseFloat(o.total),
      coupon_code: o.coupon_code,
      notes: o.notes,
      created_at: o.created_at,
      paid_at: o.paid_at,
      customer: o.customer_id
        ? {
            id: o.customer_id,
            name: o.customer_name,
            email: o.customer_email,
            phone: o.customer_phone,
          }
        : null,
      table: o.table_id
        ? {
            id: o.table_id,
            table_number: o.table_number,
            seats: o.table_seats,
          }
        : null,
      employee: {
        id: o.employee_id,
        name: o.employee_name,
      },
      items: formattedItems,
      payment: paymentRows.length > 0 ? {
        id: paymentRows[0].id,
        payment_method: paymentRows[0].payment_method,
        amount_received: parseFloat(paymentRows[0].amount_received),
        change_given: parseFloat(paymentRows[0].change_given),
        reference: paymentRows[0].reference,
        status: paymentRows[0].status,
      } : null,
    };

    res.status(200).json({
      success: true,
      data: formattedOrder,
    });
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { session_id, table_id, customer_id, items, coupon_code, notes } = req.body;

    await connection.beginTransaction();

    // Check if session is active
    const [sessionRows] = await connection.query("SELECT status FROM sessions WHERE id = ?", [session_id]);
    if (sessionRows.length === 0 || sessionRows[0].status !== "open") {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Target session is closed or does not exist",
      });
    }

    // Table-order uniqueness validation
    if (table_id) {
      const [activeOrders] = await connection.query(
        "SELECT id FROM orders WHERE table_id = ? AND status IN ('draft', 'sent_to_kds')",
        [table_id]
      );
      if (activeOrders.length > 0) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: "This table already has an active order.",
        });
      }
    }

    // Generate order number
    const [countRow] = await connection.query("SELECT COUNT(*) AS count FROM orders WHERE DATE(created_at) = CURDATE()");
    const dailyCount = countRow[0].count;
    const formattedDate = getFormattedDate();
    const orderNumber = `ORD-${formattedDate}-${String(dailyCount + 1).padStart(4, "0")}`;

    // Fetch products
    const productIds = items.map((i) => i.product_id);
    const [dbProducts] = await connection.query("SELECT * FROM products WHERE id IN (?)", [productIds]);
    const productMap = {};
    for (const p of dbProducts) {
      productMap[p.id] = p;
    }

    // Calculate subtotal
    let subtotal = 0;
    const itemsForCalculation = items.map((i) => {
      const prod = productMap[i.product_id];
      if (!prod) {
        throw new Error(`Product with ID ${i.product_id} not found`);
      }
      const price = parseFloat(prod.price);
      subtotal += price * i.quantity;
      return {
        product_id: i.product_id,
        quantity: i.quantity,
        unit_price: price,
      };
    });

    // Run promotion calculation
    const promoResult = await promotionService.calculate(itemsForCalculation, subtotal);

    // Calculate coupon discount if applicable
    let couponDiscount = 0;
    let validCouponCode = null;
    if (coupon_code) {
      const [coupons] = await connection.query("SELECT * FROM coupons WHERE code = ? AND is_active = TRUE", [
        coupon_code.trim().toUpperCase(),
      ]);
      if (coupons.length > 0) {
        const cp = coupons[0];
        validCouponCode = cp.code;
        const cpVal = parseFloat(cp.discount_value);
        if (cp.discount_type === "percentage") {
          couponDiscount = Math.round(subtotal * (cpVal / 100) * 100) / 100;
        } else {
          couponDiscount = Math.min(cpVal, subtotal);
        }
      }
    }

    // Final total calculation
    let totalTax = 0;
    let itemDiscountsTotal = 0;
    const orderDiscount = parseFloat(promoResult.order_discount || 0);

    const itemsToInsert = items.map((i) => {
      const prod = productMap[i.product_id];
      const price = parseFloat(prod.price);
      const taxPercentage = parseFloat(prod.tax_percentage);
      const itemPromo = promoResult.item_discounts.find((d) => d.product_id === i.product_id);
      const itemDiscount = itemPromo ? parseFloat(itemPromo.discount_amount) : 0.0;
      itemDiscountsTotal += itemDiscount;

      const lineTotal = (price * i.quantity) - itemDiscount;
      const tax = price * i.quantity * (taxPercentage / 100);
      totalTax += tax;

      return {
        product_id: i.product_id,
        product_name: prod.name,
        quantity: i.quantity,
        unit_price: price,
        tax_percentage: taxPercentage,
        item_discount: itemDiscount,
        line_total: lineTotal,
      };
    });

    const discountAmount = itemDiscountsTotal + orderDiscount + couponDiscount;
    const total = Math.max(0, subtotal + totalTax - discountAmount);

    // Insert order
    const [orderInsert] = await connection.query(
      `INSERT INTO orders (order_number, session_id, table_id, customer_id, employee_id, status, subtotal, tax_amount, discount_amount, total, coupon_code, notes)
       VALUES (?, ?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?)`,
      [
        orderNumber,
        session_id,
        table_id || null,
        customer_id || null,
        req.user.id,
        subtotal,
        totalTax,
        discountAmount,
        total,
        validCouponCode,
        notes || null,
      ]
    );

    const orderId = orderInsert.insertId;

    // Insert order items
    for (const item of itemsToInsert) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, tax_percentage, item_discount, line_total, kds_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'none')`,
        [
          orderId,
          item.product_id,
          item.product_name,
          item.quantity,
          item.unit_price,
          item.tax_percentage,
          item.item_discount,
          item.line_total,
        ]
      );
    }

    await connection.commit();

    // Fetch newly created full order to return
    const [newOrderRows] = await connection.query("SELECT * FROM orders WHERE id = ?", [orderId]);
    
    // Emit socket event to tables room to indicate has active order
    if (table_id) {
      const io = req.app.get("io");
      io.to("pos").emit("table:status_changed", { table_id: parseInt(table_id), has_active_order: true });
    }

    res.status(201).json({
      success: true,
      data: newOrderRows[0],
      message: "Order created successfully",
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

const updateOrder = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const { items, customer_id, table_id, coupon_code, notes } = req.body;

    await connection.beginTransaction();

    const [exists] = await connection.query("SELECT * FROM orders WHERE id = ?", [id]);
    if (exists.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const order = exists[0];
    if (order.status !== "draft") {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Only draft orders can be modified",
      });
    }

    // Fetch products
    const productIds = items.map((i) => i.product_id);
    const [dbProducts] = await connection.query("SELECT * FROM products WHERE id IN (?)", [productIds]);
    const productMap = {};
    for (const p of dbProducts) {
      productMap[p.id] = p;
    }

    // Calculate subtotal
    let subtotal = 0;
    const itemsForCalculation = items.map((i) => {
      const prod = productMap[i.product_id];
      if (!prod) throw new Error(`Product ID ${i.product_id} not found`);
      const price = parseFloat(prod.price);
      subtotal += price * i.quantity;
      return { product_id: i.product_id, quantity: i.quantity, unit_price: price };
    });

    const promoResult = await promotionService.calculate(itemsForCalculation, subtotal);

    // Calculate coupon discount
    let couponDiscount = 0;
    let validCouponCode = null;
    if (coupon_code) {
      const [coupons] = await connection.query("SELECT * FROM coupons WHERE code = ? AND is_active = TRUE", [
        coupon_code.trim().toUpperCase(),
      ]);
      if (coupons.length > 0) {
        const cp = coupons[0];
        validCouponCode = cp.code;
        const cpVal = parseFloat(cp.discount_value);
        if (cp.discount_type === "percentage") {
          couponDiscount = Math.round(subtotal * (cpVal / 100) * 100) / 100;
        } else {
          couponDiscount = Math.min(cpVal, subtotal);
        }
      }
    }

    // Final total calculation
    let totalTax = 0;
    let itemDiscountsTotal = 0;
    const orderDiscount = parseFloat(promoResult.order_discount || 0);

    const itemsToInsert = items.map((i) => {
      const prod = productMap[i.product_id];
      const price = parseFloat(prod.price);
      const taxPercentage = parseFloat(prod.tax_percentage);
      const itemPromo = promoResult.item_discounts.find((d) => d.product_id === i.product_id);
      const itemDiscount = itemPromo ? parseFloat(itemPromo.discount_amount) : 0.0;
      itemDiscountsTotal += itemDiscount;

      const lineTotal = (price * i.quantity) - itemDiscount;
      const tax = price * i.quantity * (taxPercentage / 100);
      totalTax += tax;

      return {
        product_id: i.product_id,
        product_name: prod.name,
        quantity: i.quantity,
        unit_price: price,
        tax_percentage: taxPercentage,
        item_discount: itemDiscount,
        line_total: lineTotal,
      };
    });

    const discountAmount = itemDiscountsTotal + orderDiscount + couponDiscount;
    const total = Math.max(0, subtotal + totalTax - discountAmount);

    // Delete existing items
    await connection.query("DELETE FROM order_items WHERE order_id = ?", [id]);

    // Insert new items
    for (const item of itemsToInsert) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, tax_percentage, item_discount, line_total, kds_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'none')`,
        [
          id,
          item.product_id,
          item.product_name,
          item.quantity,
          item.unit_price,
          item.tax_percentage,
          item.item_discount,
          item.line_total,
        ]
      );
    }

    // Update order headers
    await connection.query(
      `UPDATE orders 
       SET table_id = ?, customer_id = ?, subtotal = ?, tax_amount = ?, discount_amount = ?, total = ?, coupon_code = ?, notes = ?
       WHERE id = ?`,
      [
        table_id || null,
        customer_id || null,
        subtotal,
        totalTax,
        discountAmount,
        total,
        validCouponCode,
        notes || null,
        id,
      ]
    );

    // Socket notify if table changed
    if (order.table_id !== table_id) {
      const io = req.app.get("io");
      if (order.table_id) {
        io.to("pos").emit("table:status_changed", { table_id: parseInt(order.table_id), has_active_order: false });
      }
      if (table_id) {
        io.to("pos").emit("table:status_changed", { table_id: parseInt(table_id), has_active_order: true });
      }
    }

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

const deleteOrder = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;

    await connection.beginTransaction();

    const [exists] = await connection.query("SELECT * FROM orders WHERE id = ?", [id]);
    if (exists.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const order = exists[0];
    if (order.status !== "draft") {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Only draft orders can be deleted",
      });
    }

    await connection.query("DELETE FROM orders WHERE id = ?", [id]);
    
    // table status updated
    if (order.table_id) {
      const io = req.app.get("io");
      io.to("pos").emit("table:status_changed", { table_id: parseInt(order.table_id), has_active_order: false });
    }

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

const sendToKds = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;

    await connection.beginTransaction();

    const [orders] = await connection.query("SELECT * FROM orders WHERE id = ?", [id]);
    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const order = orders[0];

    // Fetch order items with their products
    const [items] = await connection.query(
      `SELECT oi.*, p.show_on_kds 
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?`,
      [id]
    );

    const kdsEligibleItems = items.filter(i => !!i.show_on_kds);

    if (kdsEligibleItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "No KDS-eligible items in this order",
      });
    }

    // Insert KDS ticket
    await connection.query(
      "INSERT INTO kds_tickets (order_id, stage) VALUES (?, 'to_cook') ON DUPLICATE KEY UPDATE stage='to_cook'",
      [id]
    );

    const [ticketRows] = await connection.query("SELECT * FROM kds_tickets WHERE order_id = ?", [id]);
    const ticket = ticketRows[0];

    const kdsItemsPayload = [];
    for (const item of kdsEligibleItems) {
      await connection.query(
        "INSERT INTO kds_item_progress (kds_ticket_id, order_item_id, is_completed) VALUES (?, ?, FALSE)",
        [ticket.id, item.id]
      );
      
      const [progressRow] = await connection.query(
        "SELECT id FROM kds_item_progress WHERE kds_ticket_id = ? AND order_item_id = ?",
        [ticket.id, item.id]
      );

      kdsItemsPayload.push({
        kds_item_id: progressRow[0].id,
        order_item_id: item.id,
        product_name: item.product_name,
        quantity: item.quantity,
        is_completed: false,
      });
    }

    // Update order status and order items kds_status
    await connection.query("UPDATE orders SET status = 'sent_to_kds' WHERE id = ?", [id]);
    await connection.query("UPDATE order_items SET kds_status = 'to_cook' WHERE order_id = ? AND product_id IN (?)", [
      id,
      kdsEligibleItems.map(i => i.product_id),
    ]);

    await connection.commit();

    const fullTicketPayload = {
      id: ticket.id,
      order_id: order.id,
      order_number: order.order_number,
      stage: "to_cook",
      sent_at: ticket.sent_at || new Date(),
      items: kdsItemsPayload,
    };

    // Emit Socket event to KDS room
    const io = req.app.get("io");
    io.to("kds").emit("kds:new_order", fullTicketPayload);
    
    // table status updated (is still active)
    if (order.table_id) {
      io.to("pos").emit("table:status_changed", { table_id: parseInt(order.table_id), has_active_order: true });
    }

    res.status(200).json({
      success: true,
      message: "Order successfully sent to kitchen",
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

const applyCoupon = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const { code } = req.body;

    await connection.beginTransaction();

    const [orders] = await connection.query("SELECT * FROM orders WHERE id = ?", [id]);
    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const order = orders[0];
    if (order.status !== "draft") {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Coupons can only be applied to draft orders",
      });
    }

    const cleanCode = code.trim().toUpperCase();
    const [coupons] = await connection.query("SELECT * FROM coupons WHERE code = ? AND is_active = TRUE", [cleanCode]);
    if (coupons.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Invalid or expired coupon",
      });
    }

    const coupon = coupons[0];
    const subtotal = parseFloat(order.subtotal);
    const tax = parseFloat(order.tax_amount);

    // Fetch order items to get sum of item discounts
    const [items] = await connection.query("SELECT SUM(item_discount) AS sum FROM order_items WHERE order_id = ?", [id]);
    const itemDiscountsTotal = parseFloat(items[0].sum || 0);

    // Fetch active promotions to get order promotion if any
    const [activeOrderPromos] = await connection.query(
      "SELECT * FROM promotions WHERE promotion_type = 'order' AND min_order_amount <= ? AND is_active = TRUE",
      [subtotal]
    );

    let orderPromoDiscount = 0;
    for (const promo of activeOrderPromos) {
      let disc = 0;
      const rate = parseFloat(promo.discount_value);
      if (promo.discount_type === "percentage") {
        disc = Math.round(subtotal * (rate / 100) * 100) / 100;
      } else {
        disc = Math.min(rate, subtotal);
      }
      if (disc > orderPromoDiscount) {
        orderPromoDiscount = disc;
      }
    }

    // Coupon discount calculation
    let couponDiscount = 0;
    const cpVal = parseFloat(coupon.discount_value);
    if (coupon.discount_type === "percentage") {
      couponDiscount = Math.round(subtotal * (cpVal / 100) * 100) / 100;
    } else {
      couponDiscount = Math.min(cpVal, subtotal);
    }

    const finalDiscountAmount = itemDiscountsTotal + orderPromoDiscount + couponDiscount;
    const finalTotal = Math.max(0, subtotal + tax - finalDiscountAmount);

    await connection.query(
      "UPDATE orders SET coupon_code = ?, discount_amount = ?, total = ? WHERE id = ?",
      [coupon.code, finalDiscountAmount, finalTotal, id]
    );

    await connection.commit();

    const [updatedRows] = await connection.query("SELECT * FROM orders WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      data: updatedRows[0],
      message: "Coupon applied successfully",
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

const sendReceiptEmail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const [rows] = await pool.query("SELECT * FROM orders WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const order = rows[0];

    // Fetch items
    const [items] = await pool.query("SELECT * FROM order_items WHERE order_id = ?", [id]);
    
    // Fetch table number
    let table = null;
    if (order.table_id) {
      const [tables] = await pool.query("SELECT table_number FROM `tables` WHERE id = ?", [order.table_id]);
      if (tables.length > 0) table = tables[0];
    }

    const fullOrder = {
      ...order,
      subtotal: parseFloat(order.subtotal),
      tax_amount: parseFloat(order.tax_amount),
      discount_amount: parseFloat(order.discount_amount),
      total: parseFloat(order.total),
      table,
      items,
    };

    await emailService.sendReceipt(fullOrder, email);

    res.status(200).json({
      success: true,
      message: `Receipt sent to ${email}`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  sendToKds,
  applyCoupon,
  sendReceiptEmail,
};
