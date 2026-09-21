import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8088/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT automatically to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("finpulse_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle common error statuses centrally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      // Token expired/invalid or forbidden - clear auth and send user to login
      const isAuthRoute = error.config?.url?.includes("/auth/");
      if (!isAuthRoute) {
        localStorage.removeItem("finpulse_token");
        localStorage.removeItem("finpulse_user");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    if (status === 500) {
      error.friendlyMessage =
        "Something went wrong on our end. Please try again shortly.";
    } else if (!error.response) {
      error.friendlyMessage =
        "Unable to reach the server. Please check your connection.";
    } else {
      error.friendlyMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
    }

    return Promise.reject(error);
  },
);

export default api;
