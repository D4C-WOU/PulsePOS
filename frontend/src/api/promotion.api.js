import axiosInstance from "./axiosInstance";

export const getPromotionsApi = async () => {
  const response = await axiosInstance.get("/promotions");
  return response.data;
};

export const createPromotionApi = async (promotionData) => {
  const response = await axiosInstance.post("/promotions", promotionData);
  return response.data;
};

export const updatePromotionApi = async (id, promotionData) => {
  const response = await axiosInstance.put(`/promotions/${id}`, promotionData);
  return response.data;
};

export const deletePromotionApi = async (id) => {
  const response = await axiosInstance.delete(`/promotions/${id}`);
  return response.data;
};

export const calculatePromotionsApi = async (items, subtotal) => {
  const response = await axiosInstance.post("/promotions/calculate", { items, subtotal });
  return response.data;
};
