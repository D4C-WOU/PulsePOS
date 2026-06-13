const db = require("../config/db");

const getProducts = async () => {
  const [products] = await db.query("SELECT * FROM products");

  return products;
};

module.exports = {
  getProducts,
};
