import axiosInstance from "./axiosInstance";

export const getCategoriesApi = async () => {
  const response = await axiosInstance.get("/categories");
  return response.data;
};

export const createCategoryApi = async (categoryData) => {
  const response = await axiosInstance.post("/categories", categoryData);
  return response.data;
};

export const updateCategoryApi = async (id, categoryData) => {
  const response = await axiosInstance.put(`/categories/${id}`, categoryData);
  return response.data;
};

export const deleteCategoryApi = async (id) => {
  const response = await axiosInstance.delete(`/categories/${id}`);
  return response.data;
};
