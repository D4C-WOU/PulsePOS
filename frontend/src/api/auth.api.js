import axiosInstance from "./axiosInstance";

export const loginApi = async (email, password) => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  return response.data;
};

export const signupApi = async (name, email, password) => {
  const response = await axiosInstance.post("/auth/signup", { name, email, password });
  return response.data;
};

export const getMeApi = async () => {
  const response = await axiosInstance.get("/auth/me");
  return response.data;
};
