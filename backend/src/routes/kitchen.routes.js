const router = require("express").Router();

const {
  getKitchenOrders,
  updateKitchenStatus,
} = require("../controllers/kitchen.controller");

router.get("/orders", getKitchenOrders);

router.patch("/:id/status", updateKitchenStatus);

module.exports = router;
