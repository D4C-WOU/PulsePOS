import axiosInstance from "./axiosInstance";

export const getDashboardDataApi = async (filters = {}) => {
  const response = await axiosInstance.get("/reports/dashboard", { params: filters });
  return response.data;
};
