// services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==================== INTERCEPTORS ====================

// Attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined" && token !== "null" && token.trim() !== "") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error),
);

// ==================== AUTH ====================
export const authAPI = {
  login: async (email, password) => {
    const res = await api.post("/auth/login", {
      userNameOrEmail: email,
      password,
    });
    const token = res.data?.data?.token || res.data?.token;
    if (token) {
      localStorage.setItem("token", token);
    }
    return res;
  },

  register: (data) => api.post("/auth/register", data),

  getProfile: (userId) => api.get(`/auth/profile/${userId}`),

  logout: () => {
    localStorage.clear();
    window.location.href = "/signin";
  },
};

// ==================== FOLLOW ====================
export const followAPI = {
  followUser: (followerId, followingId) =>
    api.post("/v1/follows/follow", null, {
      params: { followerId, followingId },
    }),

  unfollowUser: (followerId, followingId) =>
    api.delete("/v1/follows/unfollow", {
      params: { followerId, followingId },
    }),

  isFollowing: (followerId, followingId) =>
    api.get("/v1/follows/check", {
      params: { followerId, followingId },
    }),

  getFollowers: (userId, page = 0, size = 10) =>
    api.get(`/v1/follows/users/${userId}/followers`, {
      params: { page, size },
    }),

  getFollowing: (userId, page = 0, size = 10) =>
    api.get(`/v1/follows/users/${userId}/following`, {
      params: { page, size },
    }),

  getFollowersCount: (userId) =>
    api.get(`/v1/follows/users/${userId}/followers/count`),

  getFollowingCount: (userId) =>
    api.get(`/v1/follows/users/${userId}/following/count`),
};

// ==================== POSTS ====================
export const postAPI = {
  createPost: (content, imageUrl = null, videoUrl = null) =>
    api.post("/posts", { content, imageUrl, videoUrl }),

  getFeed: (page = 0, size = 10) =>
    api.get("/posts/feed", { params: { page, size } }),

  getTrending: (page = 0, size = 10) =>
    api.get("/posts/trending", { params: { page, size } }),

  getMyPosts: (page = 0, size = 10) =>
    api.get("/posts/me", { params: { page, size } }),

  getUserPosts: (userId, page = 0, size = 10) =>
    api.get(`/posts/user/${userId}`, { params: { page, size } }),

  updatePost: (postId, content) => api.put(`/posts/${postId}`, { content }),

  deletePost: (postId) => api.delete(`/posts/${postId}`),

  getPostsCount: (userId) => api.get(`/posts/user/${userId}/count`),
};

// ==================== LIKES ====================
export const likeAPI = {
  // ← Added postOwnerId param for notifications
  addLike: (userId, postId, postOwnerId = null) =>
    api.post("/likes", null, {
      params: {
        userId,
        postId: String(postId),
        ...(postOwnerId && { postOwnerId: String(postOwnerId) }),
      },
    }),

  removeLike: (userId, postId) =>
    api.delete("/likes", {
      params: {
        userId,
        postId: String(postId),
      },
    }),

  getLikeCount: (postId) =>
    api.get("/likes/count", {
      params: { postId: String(postId) },
    }),

  isLiked: (userId, postId) =>
    api.get("/likes/check", {
      params: {
        userId,
        postId: String(postId),
      },
    }),
};

// ==================== COMMENTS ====================
export const commentAPI = {
  // ← Added postOwnerId param for notifications
  addComment: (postId, userId, content, postOwnerId = null) =>
    api.post("/comments", {
      postId,
      content,
      ...(postOwnerId && { postOwnerId }),
    }),

  getComments: (postId, page = 0, size = 10) =>
    api.get(`/comments/post/${postId}`, { params: { page, size } }),

  deleteComment: (commentId) => api.delete(`/comments/${commentId}`),

  getCommentCount: (postId) => api.get(`/comments/count/${postId}`),

  updateComment: (commentId, content) =>
    api.put(`/comments/${commentId}`, content),
};

// ==================== SHARES ====================
export const shareAPI = {
  sharePost: (userId, postId) =>
    api.post("/shares", null, { params: { userId, postId } }),

  getShareCount: (postId) => api.get("/shares/count", { params: { postId } }),
};

export const accessPremiumFeature = async () => {
  const token = localStorage.getItem("token");
  const res = await api.post(
    "/premium/upgrade",
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data;
};

export const notificationAPI = {
  getNotifications: () => api.get("/notifications/my-notifications"),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put("/notifications/read-all"),
};

export const bookmarkAPI = {
  addBookmark: async (userId, postId) =>
    await api.post(`/bookmarks?userId=${userId}&postId=${postId}`),

  removeBookmark: async (userId, postId) =>
    await api.delete(`/bookmarks?userId=${userId}&postId=${postId}`),

  getBookmarks: async (userId) => await api.get(`/bookmarks/user/${userId}`),
};

export const chatAPI = {
  getChatHistory: (senderId, receiverId) =>
    api.get("/chat/history", {
      params: { senderId, receiverId },
    }),
};

export const searchUsers = async (query) => {
  const res = await api.get(`/admin/users/search?query=${query}`);
  return res.data;
};

export default api;
