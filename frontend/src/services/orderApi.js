import api from "./api";

// Get all orders
export const getOrders = async () => {
  try {
    const response = await api.get("/orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

// Get single order
export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

// Create order
export const createOrder = async (orderData) => {
  try {
    const response = await api.post("/orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (id, status) => {
  try {
    const response = await api.patch(`/orders/${id}/status`, {
      status,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// Delete order
export const deleteOrder = async (id) => {
  try {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

// Search orders
export const searchOrders = async (keyword) => {
  try {
    const response = await api.get(`/orders?search=${keyword}`);
    return response.data;
  } catch (error) {
    console.error("Error searching orders:", error);
    throw error;
  }
};

// Filter orders by status
export const getOrdersByStatus = async (status) => {
  try {
    const response = await api.get(`/orders?status=${status}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    throw error;
  }
};

// Update complete order (optional)
export const updateOrder = async (id, orderData) => {
  try {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};