const db = require("../config/db");

const salesReport = async () => {
  const [rows] = await db.query(`
      SELECT
      SUM(amount) AS revenue
      FROM payments
    `);

  return rows[0];
};

module.exports = {
  salesReport,
};
