const db = require("../config/db");

const getReceipt = async (id) => {
  const [rows] = await db.query(
    `
    SELECT *
    FROM receipts
    WHERE id = ?
    `,
    [id],
  );

  return rows[0];
};

module.exports = {
  getReceipt,
};
