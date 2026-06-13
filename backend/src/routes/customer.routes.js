const router = require("express").Router();

const {
  getCustomers,
  createCustomer,
} = require("../controllers/customer.controller");

router.get("/", getCustomers);

router.post("/", createCustomer);

module.exports = router;
