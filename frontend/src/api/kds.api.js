import axiosInstance from "./axiosInstance";

export const getKdsTicketsApi = async (filters = {}) => {
  const response = await axiosInstance.get("/kds/tickets", { params: filters });
  return response.data;
};

export const updateKdsTicketStageApi = async (id, stage) => {
  const response = await axiosInstance.put(`/kds/tickets/${id}/stage`, { stage });
  return response.data;
};

export const updateKdsItemCompletionApi = async (kdsItemId, isCompleted) => {
  const response = await axiosInstance.put(`/kds/items/${kdsItemId}/complete`, { is_completed: isCompleted });
  return response.data;
};
