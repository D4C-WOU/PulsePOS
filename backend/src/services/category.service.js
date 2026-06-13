const db = require("../config/db");

const getCategories = async () => {
  const [rows] = await db.query(`
    SELECT *
    FROM categories
    ORDER BY id DESC
  `);

  return rows;
};

const createCategory = async (name) => {
  const [result] = await db.query(
    `
    INSERT INTO categories(name)
    VALUES(?)
    `,
    [name],
  );

  const [rows] = await db.query(
    `
    SELECT *
    FROM categories
    WHERE id = ?
    `,
    [result.insertId],
  );

  return rows[0];
};

module.exports = {
  getCategories,
  createCategory,
};
