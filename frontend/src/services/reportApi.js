import api from "./api";

export const getSalesReport = () => api.get("/reports/sales");
export const getInventoryReport = () => api.get("/reports/inventory");
export const getRevenueReport = () => api.get("/reports/revenue");
export const getDashboardReport = () => api.get("/reports/dashboard");
