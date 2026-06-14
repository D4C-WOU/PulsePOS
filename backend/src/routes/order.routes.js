const express = require("express");
const { body } = require("express-validator");
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middleware/auth");
const { requireEmployee } = require("../middleware/roleCheck");

const router = express.Router();

router.use(authMiddleware);
router.use(requireEmployee);

router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrderById);

router.post(
  "/",
  [
    body("session_id").notEmpty().withMessage("Session ID is required").isNumeric().withMessage("Session ID must be numeric").toInt(),
    body("items").isArray({ min: 1 }).withMessage("At least one item is required"),
    body("items.*.product_id").notEmpty().isNumeric().withMessage("Product ID must be numeric").toInt(),
    body("items.*.quantity").notEmpty().isNumeric().withMessage("Quantity must be numeric").toInt(),
  ],
  orderController.createOrder
);

router.put(
  "/:id",
  [
    body("items").isArray({ min: 1 }).withMessage("At least one item is required"),
    body("items.*.product_id").notEmpty().isNumeric().withMessage("Product ID must be numeric").toInt(),
    body("items.*.quantity").notEmpty().isNumeric().withMessage("Quantity must be numeric").toInt(),
  ],
  orderController.updateOrder
);

router.delete("/:id", orderController.deleteOrder);

router.post("/:id/send-to-kds", orderController.sendToKds);

router.post(
  "/:id/apply-coupon",
  [
    body("code").trim().notEmpty().withMessage("Coupon code is required"),
  ],
  orderController.applyCoupon
);

router.post(
  "/:id/email-receipt",
  [
    body("email").isEmail().withMessage("Valid email address is required"),
  ],
  orderController.sendReceiptEmail
);

module.exports = router;
