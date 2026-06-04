import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

export const getModerationResults = () => API.get("/moderation/all");
export const getModerationStats = async () => {
  return API.get("/moderation/stats");
};
export const approveModeration = async (id) => {
  return API.put(`/moderation/${id}/approve`);
};

export const removeModeration = async (id) => {
  return API.put(`/moderation/${id}/remove`);
};
export const getRecentActivity = async () => {
  return API.get("/moderation/recent");
};
export const getAnalytics = async () => {
  return API.get("/moderation/analytics");
};
