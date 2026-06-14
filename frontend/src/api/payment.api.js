import axiosInstance from "./axiosInstance";

export const payWithCashApi = async (orderId, amountReceived) => {
  const response = await axiosInstance.post("/payments/cash", { order_id: orderId, amount_received: amountReceived });
  return response.data;
};

export const payWithCardApi = async (orderId, reference = "") => {
  const response = await axiosInstance.post("/payments/card", { order_id: orderId, reference });
  return response.data;
};

export const createPolarCheckoutApi = async (orderId) => {
  const response = await axiosInstance.post("/payments/polar/create-checkout", { order_id: orderId });
  return response.data;
};

export const simulatePolarPaymentApi = async (orderId) => {
  const response = await axiosInstance.post("/payments/polar/simulate", { order_id: orderId });
  return response.data;
};

export const getUpiQrApi = async (orderId) => {
  const response = await axiosInstance.get("/payments/upi-qr", { params: { order_id: orderId } });
  return response.data;
};

export const confirmUpiPaymentApi = async (orderId) => {
  const response = await axiosInstance.post("/payments/upi/confirm", { order_id: orderId });
  return response.data;
};
