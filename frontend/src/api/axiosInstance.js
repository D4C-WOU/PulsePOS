import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const savedAuth = localStorage.getItem("pos_auth");
    if (savedAuth) {
      try {
        const { state } = JSON.parse(savedAuth);
        if (state && state.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (e) {
        console.error("Error parsing auth state from localStorage:", e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration (401 / 403)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear auth storage and redirect if token is expired or user disabled
      localStorage.removeItem("pos_auth");
      
      // Prevent infinite loops if already on login page
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    
    // Format error response to extract standard API error payload
    const apiError = {
      message: error.response?.data?.message || "An unexpected error occurred",
      errors: error.response?.data?.errors || [],
      status: error.response?.status || 500,
    };
    
    return Promise.reject(apiError);
  }
);

export default axiosInstance;
