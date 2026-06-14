const express = require("express");
const { body } = require("express-validator");
const couponController = require("../controllers/coupon.controller");
const authMiddleware = require("../middleware/auth");
const { requireAdmin, requireEmployee } = require("../middleware/roleCheck");

const router = express.Router();

router.use(authMiddleware);

router.get("/", requireEmployee, couponController.getCoupons);

router.post(
  "/",
  [
    requireAdmin,
    body("code").trim().notEmpty().withMessage("Coupon code is required"),
    body("discount_type").isIn(["percentage", "fixed"]).withMessage("Invalid discount type"),
    body("discount_value").isFloat({ gt: 0 }).withMessage("Discount value must be greater than 0"),
  ],
  couponController.createCoupon
);

router.put(
  "/:id",
  [
    requireAdmin,
    body("code").trim().notEmpty().withMessage("Coupon code is required"),
    body("discount_type").isIn(["percentage", "fixed"]).withMessage("Invalid discount type"),
    body("discount_value").isFloat({ gt: 0 }).withMessage("Discount value must be greater than 0"),
  ],
  couponController.updateCoupon
);

router.delete("/:id", requireAdmin, couponController.deleteCoupon);

router.post(
  "/validate",
  [
    requireEmployee,
    body("code").trim().notEmpty().withMessage("Coupon code is required"),
    body("order_subtotal").isFloat({ min: 0 }).withMessage("Order subtotal must be a positive number"),
  ],
  couponController.validateCoupon
);

module.exports = router;
