import axiosInstance from "./axiosInstance";

export const getPaymentMethodsApi = async () => {
  const response = await axiosInstance.get("/payment-methods");
  return response.data;
};

export const updatePaymentMethodApi = async (id, data) => {
  const response = await axiosInstance.put(`/payment-methods/${id}`, data);
  return response.data;
};
