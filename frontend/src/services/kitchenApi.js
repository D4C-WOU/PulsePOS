import api from "./api";

export const getKitchenOrders = () => api.get("/kitchen/orders");
export const getKitchenOrderById = (id) => api.get(`/kitchen/orders/${id}`);
export const updateKitchenOrderStatus = (id, status) =>
  api.put(`/kitchen/orders/${id}`, { status });
