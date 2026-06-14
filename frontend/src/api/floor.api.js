import axiosInstance from "./axiosInstance";

export const getFloorsApi = async () => {
  const response = await axiosInstance.get("/floors");
  return response.data;
};

export const createFloorApi = async (floorData) => {
  const response = await axiosInstance.post("/floors", floorData);
  return response.data;
};

export const updateFloorApi = async (id, floorData) => {
  const response = await axiosInstance.put(`/floors/${id}`, floorData);
  return response.data;
};

export const deleteFloorApi = async (id) => {
  const response = await axiosInstance.delete(`/floors/${id}`);
  return response.data;
};
