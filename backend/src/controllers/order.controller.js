const orderService = require("../services/order.service");

const createOrder = async (req, res) => {
  try {
    const { tableNumber, items } = req.body;

    const order = await orderService.createOrder(tableNumber, items);

    const io = req.app.get("io");

    io.emit("order:new", order);

    console.log("[SOCKET] order:new", order.orderId);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await orderService.getOrders();

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const updatedOrder = await orderService.updateOrderStatus(orderId, status);

    const io = req.app.get("io");

    io.emit("kitchen:update", updatedOrder);

    console.log("[SOCKET] kitchen:update", updatedOrder.id);

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
};
