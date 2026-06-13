const db = require("../config/db");

const createOrder = async (tableNumber, items) => {
  let totalAmount = 0;

  for (const item of items) {
    const [productRows] = await db.query(
      "SELECT * FROM products WHERE id = ?",
      [item.productId],
    );

    const product = productRows[0];

    totalAmount += product.price * item.quantity;
  }

  const [orderResult] = await db.query(
    `
      INSERT INTO orders
      (table_number,total_amount)
      VALUES (?,?)
      `,
    [tableNumber, totalAmount],
  );

  const orderId = orderResult.insertId;

  for (const item of items) {
    const [productRows] = await db.query("SELECT * FROM products WHERE id=?", [
      item.productId,
    ]);

    const product = productRows[0];

    await db.query(
      `
      INSERT INTO order_items
      (
        order_id,
        product_id,
        quantity,
        subtotal
      )
      VALUES (?,?,?,?)
      `,
      [orderId, item.productId, item.quantity, product.price * item.quantity],
    );
  }

  return {
    orderId,
    totalAmount,
  };
};

const getOrders = async () => {
  const [orders] = await db.query(`
      SELECT *
      FROM orders
      ORDER BY created_at DESC
    `);

  return orders;
};

const updateOrderStatus = async (orderId, status) => {
  await db.query(
    `
    UPDATE orders
    SET status = ?
    WHERE id = ?
    `,
    [status, orderId],
  );

  const [updatedOrder] = await db.query("SELECT * FROM orders WHERE id=?", [
    orderId,
  ]);

  return updatedOrder[0];
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
};
