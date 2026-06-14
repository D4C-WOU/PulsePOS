const express = require("express");
const { body } = require("express-validator");
const promotionController = require("../controllers/promotion.controller");
const authMiddleware = require("../middleware/auth");
const { requireAdmin, requireEmployee } = require("../middleware/roleCheck");

const router = express.Router();

router.use(authMiddleware);

router.get("/", requireEmployee, promotionController.getPromotions);

router.post(
  "/",
  [
    requireAdmin,
    body("name").trim().notEmpty().withMessage("Promotion name is required"),
    body("promotion_type").isIn(["product", "order"]).withMessage("Invalid promotion type"),
    body("discount_type").isIn(["percentage", "fixed"]).withMessage("Invalid discount type"),
    body("discount_value").isFloat({ gt: 0 }).withMessage("Discount value must be greater than 0"),
  ],
  promotionController.createPromotion
);

router.put(
  "/:id",
  [
    requireAdmin,
    body("name").trim().notEmpty().withMessage("Promotion name is required"),
    body("promotion_type").isIn(["product", "order"]).withMessage("Invalid promotion type"),
    body("discount_type").isIn(["percentage", "fixed"]).withMessage("Invalid discount type"),
    body("discount_value").isFloat({ gt: 0 }).withMessage("Discount value must be greater than 0"),
  ],
  promotionController.updatePromotion
);

router.delete("/:id", requireAdmin, promotionController.deletePromotion);

router.post(
  "/calculate",
  [
    requireEmployee,
    body("items").isArray().withMessage("Items must be an array"),
    body("items.*.product_id").isInt().withMessage("Item product_id must be an integer"),
    body("items.*.quantity").isInt({ min: 1 }).withMessage("Item quantity must be at least 1"),
    body("items.*.unit_price").isFloat({ min: 0 }).withMessage("Item unit_price must be a positive number"),
    body("subtotal").isFloat({ min: 0 }).withMessage("Subtotal must be a positive number"),
  ],
  promotionController.calculatePromotions
);

module.exports = router;
