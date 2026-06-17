import api from "./api";

export const getReceipts = () => api.get("/receipts");
export const getReceiptById = (id) => api.get(`/receipts/${id}`);
export const generateReceipt = (orderId) =>
  api.post(`/receipts/generate/${orderId}`);
export const downloadReceipt = (receiptId) =>
  api.get(`/receipts/download/${receiptId}`, {
    responseType: "blob",
  });
