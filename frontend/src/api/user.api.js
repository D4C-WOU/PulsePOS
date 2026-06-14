import axiosInstance from "./axiosInstance";

export const getUsersApi = async () => {
  const response = await axiosInstance.get("/users");
  return response.data;
};

export const createUserApi = async (userData) => {
  const response = await axiosInstance.post("/users", userData);
  return response.data;
};

export const updateUserApi = async (id, userData) => {
  const response = await axiosInstance.put(`/users/${id}`, userData);
  return response.data;
};

export const changeUserPasswordApi = async (id, newPassword) => {
  const response = await axiosInstance.put(`/users/${id}/password`, { new_password: newPassword });
  return response.data;
};

export const archiveUserApi = async (id) => {
  const response = await axiosInstance.put(`/users/${id}/archive`);
  return response.data;
};

export const deleteUserApi = async (id) => {
  const response = await axiosInstance.delete(`/users/${id}`);
  return response.data;
};
