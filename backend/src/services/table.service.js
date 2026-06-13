const db = require("../config/db");

const getTables = async () => {
  const [rows] = await db.query(`
    SELECT *
    FROM reservation_tables
    ORDER BY table_number
  `);

  return rows;
};

const updateTableStatus = async (id, status) => {
  await db.query(
    `
    UPDATE reservation_tables
    SET table_status = ?
    WHERE id = ?
    `,
    [status, id],
  );

  const [rows] = await db.query(
    `
    SELECT *
    FROM reservation_tables
    WHERE id = ?
    `,
    [id],
  );

  return rows[0];
};

module.exports = {
  getTables,
  updateTableStatus,
};
