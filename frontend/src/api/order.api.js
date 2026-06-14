import axiosInstance from "./axiosInstance";

export const getOrdersApi = async (filters = {}) => {
  const response = await axiosInstance.get("/orders", { params: filters });
  return response.data;
};

export const getOrderByIdApi = async (id) => {
  const response = await axiosInstance.get(`/orders/${id}`);
  return response.data;
};

export const createOrderApi = async (orderData) => {
  const response = await axiosInstance.post("/orders", orderData);
  return response.data;
};

export const updateOrderApi = async (id, orderData) => {
  const response = await axiosInstance.put(`/orders/${id}`, orderData);
  return response.data;
};

export const deleteOrderApi = async (id) => {
  const response = await axiosInstance.delete(`/orders/${id}`);
  return response.data;
};

export const sendOrderToKdsApi = async (id) => {
  const response = await axiosInstance.post(`/orders/${id}/send-to-kds`);
  return response.data;
};

export const applyCouponToOrderApi = async (id, code) => {
  const response = await axiosInstance.post(`/orders/${id}/apply-coupon`, { code });
  return response.data;
};

export const emailReceiptApi = async (id, email) => {
  const response = await axiosInstance.post(`/orders/${id}/email-receipt`, { email });
  return response.data;
};
