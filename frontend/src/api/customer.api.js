import axiosInstance from "./axiosInstance";

export const getCustomersApi = async (search = "") => {
  const response = await axiosInstance.get("/customers", { params: { search } });
  return response.data;
};

export const createCustomerApi = async (customerData) => {
  const response = await axiosInstance.post("/customers", customerData);
  return response.data;
};

export const updateCustomerApi = async (id, customerData) => {
  const response = await axiosInstance.put(`/customers/${id}`, customerData);
  return response.data;
};

export const deleteCustomerApi = async (id) => {
  const response = await axiosInstance.delete(`/customers/${id}`);
  return response.data;
};
