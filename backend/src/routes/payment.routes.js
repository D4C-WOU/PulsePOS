const express = require("express");
const { body } = require("express-validator");
const paymentController = require("../controllers/payment.controller");
const authMiddleware = require("../middleware/auth");
const { requireEmployee } = require("../middleware/roleCheck");

const router = express.Router();

// Public Polar webhook (no auth)
router.post("/polar/webhook", paymentController.handlePolarWebhook);

// Protected routes (Employee+)
router.post(
  "/cash",
  [
    authMiddleware,
    requireEmployee,
    body("order_id").isInt().withMessage("Order ID must be an integer"),
    body("amount_received").isFloat({ gt: 0 }).withMessage("Amount received must be greater than 0"),
  ],
  paymentController.handleCashPayment
);

router.post(
  "/card",
  [
    authMiddleware,
    requireEmployee,
    body("order_id").isInt().withMessage("Order ID must be an integer"),
  ],
  paymentController.handleCardPayment
);

router.post(
  "/polar/create-checkout",
  [
    authMiddleware,
    requireEmployee,
    body("order_id").isInt().withMessage("Order ID must be an integer"),
  ],
  paymentController.createPolarCheckout
);

router.post(
  "/polar/simulate",
  [
    authMiddleware,
    requireEmployee,
    body("order_id").isInt().withMessage("Order ID must be an integer"),
  ],
  paymentController.simulatePolarPayment
);

router.get(
  "/upi-qr",
  [
    authMiddleware,
    requireEmployee,
  ],
  paymentController.getUpiQr
);

router.post(
  "/upi/confirm",
  [
    authMiddleware,
    requireEmployee,
    body("order_id").isInt().withMessage("Order ID must be an integer"),
  ],
  paymentController.confirmUpiPayment
);

module.exports = router;
