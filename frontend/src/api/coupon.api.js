import axiosInstance from "./axiosInstance";

export const getCouponsApi = async () => {
  const response = await axiosInstance.get("/coupons");
  return response.data;
};

export const createCouponApi = async (couponData) => {
  const response = await axiosInstance.post("/coupons", couponData);
  return response.data;
};

export const updateCouponApi = async (id, couponData) => {
  const response = await axiosInstance.put(`/coupons/${id}`, couponData);
  return response.data;
};

export const deleteCouponApi = async (id) => {
  const response = await axiosInstance.delete(`/coupons/${id}`);
  return response.data;
};

export const validateCouponApi = async (code, orderSubtotal) => {
  const response = await axiosInstance.post("/coupons/validate", { code, order_subtotal: orderSubtotal });
  return response.data;
};
