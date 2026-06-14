import axiosInstance from "./axiosInstance";

export const getSessionsApi = async () => {
  const response = await axiosInstance.get("/sessions");
  return response.data;
};

export const getActiveSessionApi = async () => {
  const response = await axiosInstance.get("/sessions/active");
  return response.data;
};

export const openSessionApi = async () => {
  const response = await axiosInstance.post("/sessions/open");
  return response.data;
};

export const closeSessionApi = async (id) => {
  const response = await axiosInstance.post(`/sessions/close/${id}`);
  return response.data;
};
