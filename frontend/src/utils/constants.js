// API URLs

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  "http://localhost:5000";


// User Roles

export const USER_ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  CASHIER: "cashier",
  CHEF: "chef",
};


// Order Status

export const ORDER_STATUS = {
  PENDING: "Pending",
  PREPARING: "Preparing",
  READY: "Ready",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};


// Payment Methods

export const PAYMENT_METHODS = {
  CASH: "Cash",
  CARD: "Card",
  UPI: "UPI",
};


// Table Status

export const TABLE_STATUS = {
  AVAILABLE: "Available",
  OCCUPIED: "Occupied",
  RESERVED: "Reserved",
};


// Dashboard Colors

export const COLORS = {
  background: "#0B1120",
  card: "#111827",
  orange: "#FF7A00",
  green: "#22C55E",
  blue: "#3B82F6",
  text: "#F8FAFC",
  muted: "#94A3B8",
};