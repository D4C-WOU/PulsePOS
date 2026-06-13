const productService = require("../services/product.service");

const getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProducts,
};
