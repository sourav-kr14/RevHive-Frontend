// services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
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
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      localStorage.clear();
      window.location.href = "/signin";
    }

    return Promise.reject(error);
  },
);

// ==================== AUTH ====================
export const authAPI = {
  login: async (email, password) => {
    const res = await api.post("/auth/login", {
      userNameOrEmail: email,
      password,
    });

    // ✅ store token
    localStorage.setItem("token", res.data.token);
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
  addLike: (userId, postId) =>
    api.post("/likes", null, { params: { userId, postId } }),

  removeLike: (userId, postId) =>
    api.delete("/likes", { params: { userId, postId } }),

  getLikeCount: (postId) => api.get("/likes/count", { params: { postId } }),

  isLiked: (userId, postId) =>
    api.get("/likes/status", { params: { userId, postId } }),
};

// ==================== COMMENTS ====================
export const commentAPI = {
  addComment: (postId, userId, content) =>
    api.post("/comments", { postId, userId, content }),

  getComments: (postId, page = 0, size = 10) =>
    api.get(`/comments/post/${postId}`, { params: { page, size } }),

  deleteComment: (commentId) => api.delete(`/comments/${commentId}`),
};

// ==================== SHARES ====================
export const shareAPI = {
  sharePost: (userId, postId) =>
    api.post("/shares", null, { params: { userId, postId } }),

  getShareCount: (postId) => api.get("/shares/count", { params: { postId } }),
};

export const accessPremiumFeature = async () => {
  const token = localStorage.getItem("token");

  const res = await api.get("/premium/upgrade", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export default api;
