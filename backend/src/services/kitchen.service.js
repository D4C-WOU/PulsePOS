const db = require("../config/db");

const getKitchenOrders = async () => {
  const [rows] = await db.query(`
    SELECT *
    FROM kitchen_orders
    ORDER BY id DESC
  `);

  return rows;
};

const updateKitchenStatus = async (id, status) => {
  await db.query(
    `
    UPDATE kitchen_orders
    SET order_status = ?
    WHERE id = ?
    `,
    [status, id],
  );

  const [rows] = await db.query(
    `
    SELECT *
    FROM kitchen_orders
    WHERE id = ?
    `,
    [id],
  );

  return rows[0];
};

module.exports = {
  getKitchenOrders,
  updateKitchenStatus,
};
