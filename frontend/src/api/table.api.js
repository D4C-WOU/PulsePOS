import axiosInstance from "./axiosInstance";

export const getTablesApi = async (filters = {}) => {
  const response = await axiosInstance.get("/tables", { params: filters });
  return response.data;
};

export const createTableApi = async (tableData) => {
  const response = await axiosInstance.post("/tables", tableData);
  return response.data;
};

export const updateTableApi = async (id, tableData) => {
  const response = await axiosInstance.put(`/tables/${id}`, tableData);
  return response.data;
};

export const deleteTableApi = async (id) => {
  const response = await axiosInstance.delete(`/tables/${id}`);
  return response.data;
};
