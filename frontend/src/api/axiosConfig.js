import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8088/api";

console.log("FinPulse API URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("finpulse_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      "API Request:",
      config.method?.toUpperCase(),
      config.url
    );

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log(
      "API Response:",
      response.status,
      response.config.url
    );

    return response;
  },
  (error) => {
    console.error("API ERROR:", error);
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);
    console.error("Request URL:", error.config?.url);

    const status = error.response?.status;
    const responseMessage = error.response?.data?.message;

    if (status === 401 || status === 403) {
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
        responseMessage ||
        "Server error. Please check the backend logs.";
    } else if (!error.response) {
      error.friendlyMessage =
        "Unable to reach the backend server.";
    } else {
      error.friendlyMessage =
        responseMessage ||
        `Request failed with status ${status}.`;
    }

    return Promise.reject(error);
  }
);

export default api;
