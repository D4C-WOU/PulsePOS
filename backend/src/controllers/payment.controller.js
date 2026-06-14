const QRCode = require("qrcode");
const { validationResult } = require("express-validator");
const pool = require("../config/db");
const polarService = require("../services/polar.service");

const handleCashPayment = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { order_id, amount_received } = req.body;
    const received = parseFloat(amount_received);

    await connection.beginTransaction();

    const [orders] = await connection.query("SELECT * FROM orders WHERE id = ?", [order_id]);
    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const order = orders[0];
    if (order.status !== "sent_to_kds" && order.status !== "draft") {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Order cannot be paid in its current status",
      });
    }

    const total = parseFloat(order.total);
    if (received < total) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Amount received is less than the order total",
      });
    }

    const changeGiven = Math.round((received - total) * 100) / 100;

    // Insert payment record
    const [paymentResult] = await connection.query(
      `INSERT INTO payments (order_id, payment_method, amount_received, change_given, status)
       VALUES (?, 'cash', ?, ?, 'completed')`,
      [order_id, received, changeGiven]
    );

    // Update order status to paid
    await connection.query(
      "UPDATE orders SET status = 'paid', paid_at = NOW() WHERE id = ?",
      [order_id]
    );

    await connection.commit();

    const io = req.app.get("io");
    io.to("pos").emit("order:paid", {
      order_id: parseInt(order_id),
      order_number: order.order_number,
      table_id: order.table_id,
    });

    if (order.table_id) {
      io.to("pos").emit("table:status_changed", {
        table_id: order.table_id,
        has_active_order: false,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        payment_id: paymentResult.insertId,
        change_given: changeGiven,
        order: {
          id: order.id,
          order_number: order.order_number,
          total: total,
          status: "paid",
        },
      },
      message: "Cash payment processed successfully",
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

const handleCardPayment = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { order_id, reference } = req.body;

    await connection.beginTransaction();

    const [orders] = await connection.query("SELECT * FROM orders WHERE id = ?", [order_id]);
    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const order = orders[0];
    if (order.status !== "sent_to_kds" && order.status !== "draft") {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Order cannot be paid in its current status",
      });
    }

    const total = parseFloat(order.total);

    // Insert payment record
    const [paymentResult] = await connection.query(
      `INSERT INTO payments (order_id, payment_method, amount_received, change_given, reference, status)
       VALUES (?, 'card', ?, 0.00, ?, 'completed')`,
      [order_id, total, reference || null]
    );

    // Update order status
    await connection.query(
      "UPDATE orders SET status = 'paid', paid_at = NOW() WHERE id = ?",
      [order_id]
    );

    await connection.commit();

    const io = req.app.get("io");
    io.to("pos").emit("order:paid", {
      order_id: parseInt(order_id),
      order_number: order.order_number,
      table_id: order.table_id,
    });

    if (order.table_id) {
      io.to("pos").emit("table:status_changed", {
        table_id: order.table_id,
        has_active_order: false,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        payment_id: paymentResult.insertId,
        order: {
          id: order.id,
          order_number: order.order_number,
          total: total,
          status: "paid",
        },
      },
      message: "Card payment confirmed successfully",
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

const createPolarCheckout = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { order_id } = req.body;

    await connection.beginTransaction();

    const [orders] = await connection.query("SELECT * FROM orders WHERE id = ?", [order_id]);
    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const order = orders[0];
    
    // Call Polar service
    const checkout = await polarService.createCheckout(order);

    // Save pending payment with polar checkout id
    await connection.query(
      `INSERT INTO payments (order_id, payment_method, amount_received, change_given, polar_checkout_id, status)
       VALUES (?, 'card', ?, 0.00, ?, 'pending')`,
      [order_id, parseFloat(order.total), checkout.polar_checkout_id]
    );

    await connection.commit();

    res.status(200).json({
      success: true,
      data: {
        checkout_url: checkout.checkout_url,
        polar_checkout_id: checkout.polar_checkout_id,
      },
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

const handlePolarWebhook = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    // Polar webhooks verification
    const signature = req.headers["polar-signature"];
    const secret = process.env.POLAR_WEBHOOK_SECRET;
    
    // Express raw body is needed for signature verification
    // (Ensure express.raw() or a custom parser parses raw body under req.rawBody)
    const rawBody = req.rawBody || JSON.stringify(req.body);

    if (secret && signature) {
      const isValid = polarService.verifyWebhookSignature(rawBody, signature, secret);
      if (!isValid) {
        return res.status(401).json({ success: false, message: "Invalid signature" });
      }
    }

    const event = req.body;
    // We listen to checkout.created or checkout.order.completed
    if (event.type === "checkout.order.completed" || event.type === "order.created") {
      const checkoutId = event.data.checkout_id || (event.data.checkout && event.data.checkout.id);
      
      await connection.beginTransaction();

      // Find pending payment
      const [payments] = await connection.query(
        "SELECT id, order_id FROM payments WHERE polar_checkout_id = ? AND status = 'pending'",
        [checkoutId]
      );

      if (payments.length > 0) {
        const payment = payments[0];

        // Update payment status
        await connection.query("UPDATE payments SET status = 'completed' WHERE id = ?", [payment.id]);

        // Update order status to paid
        await connection.query(
          "UPDATE orders SET status = 'paid', paid_at = NOW() WHERE id = ?",
          [payment.order_id]
        );

        // Fetch order info
        const [orders] = await connection.query("SELECT order_number, table_id FROM orders WHERE id = ?", [payment.order_id]);
        const order = orders[0];

        await connection.commit();

        const io = req.app.get("io");
        io.to("pos").emit("order:paid", {
          order_id: payment.order_id,
          order_number: order.order_number,
          table_id: order.table_id,
        });

        if (order.table_id) {
          io.to("pos").emit("table:status_changed", {
            table_id: order.table_id,
            has_active_order: false,
          });
        }
      } else {
        await connection.rollback();
      }
    }

    res.status(200).json({ success: true, message: "Webhook processed" });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

const simulatePolarPayment = async (req, res, next) => {
  // REMOVE THIS ENDPOINT IN PRODUCTION
  const connection = await pool.getConnection();
  try {
    const { order_id } = req.body;

    await connection.beginTransaction();

    const [orders] = await connection.query("SELECT * FROM orders WHERE id = ?", [order_id]);
    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const order = orders[0];

    // Find pending Polar payment or insert if none
    const [exists] = await connection.query(
      "SELECT id FROM payments WHERE order_id = ? AND payment_method = 'card' AND status = 'pending'",
      [order_id]
    );

    if (exists.length > 0) {
      await connection.query("UPDATE payments SET status = 'completed' WHERE id = ?", [exists[0].id]);
    } else {
      await connection.query(
        `INSERT INTO payments (order_id, payment_method, amount_received, change_given, status)
         VALUES (?, 'card', ?, 0.00, 'completed')`,
        [order_id, parseFloat(order.total)]
      );
    }

    await connection.query(
      "UPDATE orders SET status = 'paid', paid_at = NOW() WHERE id = ?",
      [order_id]
    );

    await connection.commit();

    const io = req.app.get("io");
    io.to("pos").emit("order:paid", {
      order_id: parseInt(order_id),
      order_number: order.order_number,
      table_id: order.table_id,
    });

    if (order.table_id) {
      io.to("pos").emit("table:status_changed", {
        table_id: order.table_id,
        has_active_order: false,
      });
    }

    res.status(200).json({
      success: true,
      message: "Polar payment successfully simulated",
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

const getUpiQr = async (req, res, next) => {
  try {
    const { order_id } = req.query;

    const [orders] = await pool.query("SELECT * FROM orders WHERE id = ?", [order_id]);
    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const order = orders[0];

    const [upiMethods] = await pool.query(
      "SELECT upi_id FROM payment_methods WHERE type = 'upi' AND is_enabled = TRUE"
    );

    if (upiMethods.length === 0) {
      return res.status(400).json({
        success: false,
        message: "UPI Payment Method is currently disabled",
      });
    }

    const upiId = upiMethods[0].upi_id;

    // Build UPI Payload
    // Format: upi://pay?pa=address&pn=name&am=amount&cu=currency&tn=note
    const upiString = `upi://pay?pa=${upiId}&pn=Odoo%20Cafe&am=${parseFloat(order.total).toFixed(2)}&cu=INR&tn=Order%20${order.order_number}`;

    // Convert to QR base64
    const qrBase64 = await QRCode.toDataURL(upiString, { width: 300 });

    res.status(200).json({
      success: true,
      data: {
        qr_base64: qrBase64,
        upi_id: upiId,
        amount: parseFloat(order.total),
        order_number: order.order_number,
      },
    });
  } catch (error) {
    next(error);
  }
};

const confirmUpiPayment = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { order_id } = req.body;

    await connection.beginTransaction();

    const [orders] = await connection.query("SELECT * FROM orders WHERE id = ?", [order_id]);
    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const order = orders[0];
    if (order.status !== "sent_to_kds" && order.status !== "draft") {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Order cannot be paid in its current status",
      });
    }

    const total = parseFloat(order.total);

    // Insert payment record
    const [paymentResult] = await connection.query(
      `INSERT INTO payments (order_id, payment_method, amount_received, change_given, status)
       VALUES (?, 'upi', ?, 0.00, 'completed')`,
      [order_id, total]
    );

    // Update order status to paid
    await connection.query(
      "UPDATE orders SET status = 'paid', paid_at = NOW() WHERE id = ?",
      [order_id]
    );

    await connection.commit();

    const io = req.app.get("io");
    io.to("pos").emit("order:paid", {
      order_id: parseInt(order_id),
      order_number: order.order_number,
      table_id: order.table_id,
    });

    if (order.table_id) {
      io.to("pos").emit("table:status_changed", {
        table_id: order.table_id,
        has_active_order: false,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        payment_id: paymentResult.insertId,
        order: {
          id: order.id,
          order_number: order.order_number,
          total: total,
          status: "paid",
        },
      },
      message: "UPI payment confirmed successfully",
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

module.exports = {
  handleCashPayment,
  handleCardPayment,
  createPolarCheckout,
  handlePolarWebhook,
  simulatePolarPayment,
  getUpiQr,
  confirmUpiPayment,
};
