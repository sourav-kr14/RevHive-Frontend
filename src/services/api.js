// services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} - ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("[API Response Error]", error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

// ==================== POST API ====================
export const postAPI = {
  // Create
  createPost: (content, imageUrl = null, videoUrl = null) => 
    api.post('/posts', { content, imageUrl, videoUrl }),
  
  // Read
  getFeed: (page = 0, size = 10) => 
    api.get('/posts/feed', { params: { page, size } }),
  
  getTrending: (page = 0, size = 10) => 
    api.get('/posts/trending', { params: { page, size } }),
  
  getMyPosts: (page = 0, size = 10) => 
    api.get('/posts/me', { params: { page, size } }),
  
  getUserPosts: (userId, page = 0, size = 10) => 
    api.get(`/posts/user/${userId}`, { params: { page, size } }),
  
  getPostById: (postId) => 
    api.get(`/posts/${postId}`),
  
  searchPosts: (query, page = 0, size = 10) => 
    api.get('/posts/search', { params: { q: query, page, size } }),
  
  // Update
  updatePost: (postId, content, imageUrl = null, videoUrl = null) => 
    api.put(`/posts/${postId}`, { content, imageUrl, videoUrl }),
  
  // Delete
  deletePost: (postId) => 
    api.delete(`/posts/${postId}`),
  
  softDeletePost: (postId) => 
    api.delete(`/posts/${postId}/soft`),
  
  restorePost: (postId) => 
    api.post(`/posts/${postId}/restore`),
  
  // Interactions
  likePost: (postId) => 
    api.post(`/posts/${postId}/like`),
  
  unlikePost: (postId) => 
    api.delete(`/posts/${postId}/like`),
};

// ==================== FOLLOW API ====================
// services/api.js - Add/Update followAPI
export const followAPI = {
  followUser: (followerId, followingId) => 
    api.post('/v1/follows/follow', null, { params: { followerId, followingId } }),
  
  unfollowUser: (followerId, followingId) => 
    api.delete('/v1/follows/unfollow', { params: { followerId, followingId } }),
  
  isFollowing: (followerId, followingId) => 
    api.get('/v1/follows/check', { params: { followerId, followingId } }),
  
  getFollowers: (userId, page = 0, size = 10) => 
    api.get(`/v1/follows/users/${userId}/followers`, { params: { page, size } }),
  
  getFollowing: (userId, page = 0, size = 10) => 
    api.get(`/v1/follows/users/${userId}/following`, { params: { page, size } }),
  
  getFollowersCount: (userId) => 
    api.get(`/v1/follows/users/${userId}/followers/count`),
  
  getFollowingCount: (userId) => 
    api.get(`/v1/follows/users/${userId}/following/count`),
};

// ==================== LIKE API ====================
export const likeAPI = {
  addLike: (userId, postId) => 
    api.post('/likes', null, { params: { userId, postId } }),
  
  removeLike: (userId, postId) => 
    api.delete('/likes', { params: { userId, postId } }),
  
  getLikeCount: (postId) => 
    api.get('/likes/count', { params: { postId } }),
  
  isLiked: (userId, postId) => 
    api.get('/likes/status', { params: { userId, postId } }),
};

export const commentAPI = {
  addComment: (postId, userId, content) => 
    api.post('/comments', { postId, userId, content }),
  
  getComments: (postId, page = 0, size = 10) => 
    api.get(`/comments/post/${postId}`, { params: { page, size } }),
  
  deleteComment: (commentId) => 
    api.delete(`/comments/${commentId}`),
  
  updateComment: (commentId, content) => 
    api.put(`/comments/${commentId}`, { content }),
  
  getCommentCount: (postId) => 
    api.get(`/comments/count/${postId}`),
};


// ==================== SHARE API ====================
export const shareAPI = {
  sharePost: (userId, postId) => 
    api.post('/shares', null, { params: { userId, postId } }),
  
  getShareCount: (postId) => 
    api.get('/shares/count', { params: { postId } }),
  
  getShares: (postId) => 
    api.get('/shares', { params: { postId } }),
};

// ==================== AUTH API ====================
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/signin', { email, password }),
  
  register: (userData) => 
    api.post('/auth/signup', userData),
  
  getProfile: (userId) => 
    api.get(`/auth/profile/${userId}`),
  
  updateProfile: (userId, profileData) => 
    api.put(`/auth/profile/${userId}`, profileData),
  
  logout: () => 
    api.post('/auth/logout'),
};

export default api;