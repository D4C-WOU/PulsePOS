const db = require("../config/db");

const createPayment = async (orderId, method, amount) => {
  const [result] = await db.query(
    `
    INSERT INTO payments
    (order_id, method, amount)
    VALUES (?, ?, ?)
    `,
    [orderId, method, amount],
  );

  // mark order paid
  await db.query(
    `
    UPDATE orders
    SET status = 'Paid'
    WHERE id = ?
    `,
    [orderId],
  );

  // create receipt
  await db.query(
    `
    INSERT INTO receipts
    (
      order_id,
      payment_id,
      receipt_number
    )
    VALUES (?, ?, ?)
    `,
    [
      orderId,
      result.insertId,
      `RCP-${result.insertId.toString().padStart(5, "0")}`,
    ],
  );

  const [payment] = await db.query(
    `
    SELECT *
    FROM payments
    WHERE id = ?
    `,
    [result.insertId],
  );

  return payment[0];
};

module.exports = {
  createPayment,
};
