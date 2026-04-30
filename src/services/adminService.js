import api from "../api/api";

export const getCurrentUser = () => api.get("/auth/me");

export const getAnalytics = () => api.get("/admin/analytics");

export const getAllUsers = () => api.get("/admin/users");
