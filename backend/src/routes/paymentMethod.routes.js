const express = require("express");
const { body } = require("express-validator");
const paymentMethodController = require("../controllers/paymentMethod.controller");
const authMiddleware = require("../middleware/auth");
const { requireAdmin, requireEmployee } = require("../middleware/roleCheck");

const router = express.Router();

router.use(authMiddleware);

router.get("/", requireEmployee, paymentMethodController.getPaymentMethods);

router.put(
  "/:id",
  [
    requireAdmin,
    body("is_enabled").isBoolean().withMessage("is_enabled must be a boolean"),
  ],
  paymentMethodController.updatePaymentMethod
);

module.exports = router;
