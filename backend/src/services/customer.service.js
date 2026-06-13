const db = require("../config/db");

const getCustomers = async () => {
  const [rows] = await db.query("SELECT * FROM customers");

  return rows;
};

const createCustomer = async (name, phone, email) => {
  const [result] = await db.query(
    `
    INSERT INTO customers
    (name,phone,email)
    VALUES(?,?,?)
    `,
    [name, phone, email],
  );

  return result;
};

module.exports = {
  getCustomers,
  createCustomer,
};
