import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 10000,
});

// Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Handle common API errors globally
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    switch (status) {
      case 401:
        // Unauthorized / Expired token
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Prevent redirect loops
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        break;

      case 403:
        console.error("Access denied. Insufficient permissions.");
        break;

      case 404:
        console.error("Requested resource not found.");
        break;

      case 500:
        console.error("Internal server error.");
        break;

      default:
        break;
    }

    return Promise.reject(error);
  },
);

export default api;
