const paymentService = require("../services/payment.service");

const createPayment = async (req, res) => {
  try {
    const { orderId, method, amount } = req.body;

    const payment = await paymentService.createPayment(orderId, method, amount);

    const io = req.app.get("io");

    io.emit("payment:success", payment);

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPayment,
};
