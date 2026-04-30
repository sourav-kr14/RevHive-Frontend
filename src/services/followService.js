import api from "./api";

export const followUser = async (followerId, followingId) => {
  try {
    const response = await api.post(
      `/v1/follows/follow?followerId=${followerId}&followingId=${followingId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error following user:", error);
    throw error;
  }
};

export const unfollowUser = async (followerId, followingId) => {
  try {
    const response = await api.delete(
      `/v1/follows/unfollow?followerId=${followerId}&followingId=${followingId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error unfollowing user:", error);
    throw error;
  }
};

export const isFollowing = async (followerId, followingId) => {
  try {
    const response = await api.get(
      `/v1/follows/check?followerId=${followerId}&followingId=${followingId}`
    );
    return response.data.isFollowing;
  } catch (error) {
    console.error("Error checking follow status:", error);
    throw error;
  }
};

export const getFollowersCount = async (userId) => {
  try {
    const response = await api.get(`/v1/follows/users/${userId}/followers/count`);
    return response.data.followersCount;
  } catch (error) {
    console.error("Error fetching followers count:", error);
    throw error;
  }
};

export const getFollowingCount = async (userId) => {
  try {
    const response = await api.get(`/v1/follows/users/${userId}/following/count`);
    return response.data.followingCount;
  } catch (error) {
    console.error("Error fetching following count:", error);
    throw error;
  }
};

export const getFollowers = async (userId, page = 0, size = 10) => {
  try {
    const response = await api.get(
      `/v1/follows/users/${userId}/followers?page=${page}&size=${size}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching followers:", error);
    throw error;
  }
};

export const getFollowing = async (userId, page = 0, size = 10) => {
  try {
    const response = await api.get(
      `/v1/follows/users/${userId}/following?page=${page}&size=${size}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching following:", error);
    throw error;
  }
};

