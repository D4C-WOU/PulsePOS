const router = require("express").Router();

const { createPayment } = require("../controllers/payment.controller");

router.post("/payment", createPayment);

module.exports = router;
