import api from "../api/axiosConfig";

// --- Auth ---
export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
};

// --- User ---
export const userService = {
  getProfile: () => api.get("/users/me"),
};

// --- Transactions ---
export const transactionService = {
  getAll: () => api.get("/transactions"),
  getById: (id) => api.get(`/transactions/${id}`),
  create: (data) => api.post("/transactions", data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
  getMonthly: () => api.get("/transactions/monthly"),
};

// --- Goals ---
export const goalService = {
  getAll: () => api.get("/goals"),
  getById: (id) => api.get(`/goals/${id}`),
  create: (data) => api.post("/goals", data),
  update: (id, data) => api.put(`/goals/${id}`, data),
  delete: (id) => api.delete(`/goals/${id}`),
  contribute: (id, amount) => api.post(`/goals/${id}/contribute`, { amount }),
};

// --- Analytics ---
export const analyticsService = {
  getDashboard: () => api.get("/analytics/dashboard"),
  getCategoryBreakdown: () => api.get("/analytics/category"),
  getMonthly: () => api.get("/analytics/monthly"),
  getSummary: () => api.get("/analytics/summary"),
};

// --- AI ---
export const aiService = {
  analyze: () => api.post("/ai/analyze"),
};

// --- Admin ---
export const adminService = {
  getStats: () => api.get("/admin/stats"),
};
