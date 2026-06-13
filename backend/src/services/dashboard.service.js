const db = require("../config/db");

const getDashboardData = async () => {
  const [revenue] = await db.query(`
    SELECT IFNULL(SUM(amount),0) AS totalRevenue
    FROM payments
  `);

  const [orders] = await db.query(`
    SELECT COUNT(*) AS totalOrders
    FROM orders
  `);

  const [pending] = await db.query(`
    SELECT COUNT(*) AS pendingOrders
    FROM orders
    WHERE status != 'Paid'
  `);

  const [completed] = await db.query(`
    SELECT COUNT(*) AS completedOrders
    FROM orders
    WHERE status='Paid'
  `);

  return {
    totalRevenue: revenue[0].totalRevenue,
    totalOrders: orders[0].totalOrders,
    pendingOrders: pending[0].pendingOrders,
    completedOrders: completed[0].completedOrders,
  };
};

module.exports = {
  getDashboardData,
};
