const router = require("express").Router();

const { getProducts } = require("../controllers/product.controller");

router.get("/", getProducts);

module.exports = router;
