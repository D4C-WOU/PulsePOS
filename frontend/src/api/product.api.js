import axiosInstance from "./axiosInstance";

export const getProductsApi = async (filters = {}) => {
  const response = await axiosInstance.get("/products", { params: filters });
  return response.data;
};

export const createProductApi = async (productData) => {
  const response = await axiosInstance.post("/products", productData);
  return response.data;
};

export const updateProductApi = async (id, productData) => {
  const response = await axiosInstance.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProductApi = async (id) => {
  const response = await axiosInstance.delete(`/products/${id}`);
  return response.data;
};
