// ✅ import once
import api from "../services/api";

// ==================== USER ====================
export const userAPI = {
  getCurrentUser: () => api.get("/auth/me"),
};

// ==================== ADMIN ===================
export const adminAPI = {
  getAnalytics: () => api.get("/admin/analytics"),
  getAllUsers: () => api.get("/admin/users"),
  getStats: () => api.get("/admin/stats"),
};
