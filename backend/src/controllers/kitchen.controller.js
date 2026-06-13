const kitchenService = require("../services/kitchen.service");

const getKitchenOrders = async (req, res) => {
  try {
    const orders = await kitchenService.getKitchenOrders();

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateKitchenStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { status } = req.body;

    const updated = await kitchenService.updateKitchenStatus(id, status);

    const io = req.app.get("io");

    io.emit("kitchen:update", updated);

    io.emit("dashboard:update", updated);

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getKitchenOrders,
  updateKitchenStatus,
};
