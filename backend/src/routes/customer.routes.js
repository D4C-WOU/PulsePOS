const express = require("express");
const { body } = require("express-validator");
const customerController = require("../controllers/customer.controller");
const authMiddleware = require("../middleware/auth");
const { requireEmployee } = require("../middleware/roleCheck");

const router = express.Router();

router.use(authMiddleware);
router.use(requireEmployee);

router.get("/", customerController.getCustomers);

router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Customer name is required"),
  ],
  customerController.createCustomer
);

router.put(
  "/:id",
  [
    body("name").trim().notEmpty().withMessage("Customer name is required"),
  ],
  customerController.updateCustomer
);

router.delete("/:id", customerController.deleteCustomer);

module.exports = router;
