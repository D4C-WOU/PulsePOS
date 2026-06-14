const express = require("express");
const { body } = require("express-validator");
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middleware/auth");
const { requireAdmin, requireEmployee } = require("../middleware/roleCheck");

const router = express.Router();

router.use(authMiddleware);

router.get("/", requireEmployee, productController.getProducts);

router.post(
  "/",
  [
    requireAdmin,
    body("name").trim().notEmpty().withMessage("Product name is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
    body("tax_percentage").isFloat({ min: 0, max: 100 }).withMessage("Tax percentage must be between 0 and 100"),
    body("unit_of_measure").trim().notEmpty().withMessage("Unit of measure is required"),
  ],
  productController.createProduct
);

router.put(
  "/:id",
  [
    requireAdmin,
    body("name").trim().notEmpty().withMessage("Product name is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
    body("tax_percentage").isFloat({ min: 0, max: 100 }).withMessage("Tax percentage must be between 0 and 100"),
    body("unit_of_measure").trim().notEmpty().withMessage("Unit of measure is required"),
  ],
  productController.updateProduct
);

router.delete("/:id", requireAdmin, productController.deleteProduct);

module.exports = router;
