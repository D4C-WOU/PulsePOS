const db = require("../config/db");

const getEmployees = async () => {
  const [rows] = await db.query(`
    SELECT
      e.*,
      u.name,
      u.email,
      u.role
    FROM employees e
    JOIN users u
      ON e.user_id = u.id
  `);

  return rows;
};

module.exports = {
  getEmployees,
};
