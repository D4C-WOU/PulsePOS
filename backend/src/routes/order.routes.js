const router = require("express").Router();

const {
  createOrder,
  getOrders,
  updateOrderStatus,
} = require("../controllers/order.controller");

router.post("/create-order", createOrder);

router.get("/orders", getOrders);

router.patch("/order-status", updateOrderStatus);

module.exports = router;
