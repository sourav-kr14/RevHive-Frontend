// src/services/notificationService.js
import api from './api';

export const notificationService = {
  // Get all notifications with pagination
  getNotifications: async (userId, page = 0, size = 20) => {
    try {
      const response = await api.get(`/v1/notifications/users/${userId}`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  // Get unread notifications only
  getUnreadNotifications: async (userId) => {
    try {
      const response = await api.get(`/v1/notifications/users/${userId}/unread`);
      return response.data;
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
      throw error;
    }
  },

  // Get unread count
  getUnreadCount: async (userId) => {
    try {
      const response = await api.get(`/v1/notifications/users/${userId}/unread/count`);
      return response.data;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      return { unreadCount: 0 };
    }
  },

  // Get notifications by type
  getNotificationsByType: async (userId, type, page = 0, size = 20) => {
    try {
      const response = await api.get(`/v1/notifications/users/${userId}/type/${type}`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications by type:", error);
      throw error;
    }
  },

  // Get latest notification
  getLatestNotification: async (userId) => {
    try {
      const response = await api.get(`/v1/notifications/users/${userId}/latest`);
      return response.data;
    } catch (error) {
      console.error("Error fetching latest notification:", error);
      throw error;
    }
  },

  // Get notification statistics
  getStatistics: async (userId) => {
    try {
      const response = await api.get(`/v1/notifications/users/${userId}/statistics`);
      return response.data;
    } catch (error) {
      console.error("Error fetching statistics:", error);
      throw error;
    }
  },

  // Mark single notification as read
  markAsRead: async (notificationId, userId) => {
    try {
      const response = await api.put(`/v1/notifications/${notificationId}/read`, null, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (userId) => {
    try {
      const response = await api.put(`/v1/notifications/users/${userId}/read-all`);
      return response.data;
    } catch (error) {
      console.error("Error marking all as read:", error);
      throw error;
    }
  },

  // Batch mark as read
  batchMarkAsRead: async (userId, notificationIds) => {
    try {
      const response = await api.put(`/v1/notifications/batch-read`, notificationIds, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error("Error batch marking as read:", error);
      throw error;
    }
  },

  // Delete a notification
  deleteNotification: async (notificationId, userId) => {
    try {
      const response = await api.delete(`/v1/notifications/${notificationId}`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },

  // Delete all notifications
  deleteAllNotifications: async (userId) => {
    try {
      const response = await api.delete(`/v1/notifications/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting all notifications:", error);
      throw error;
    }
  },

  // Check if user has unread notifications
  hasUnread: async (userId) => {
    try {
      const response = await api.get(`/v1/notifications/users/${userId}/has-unread`);
      return response.data.hasUnread;
    } catch (error) {
      console.error("Error checking unread:", error);
      return false;
    }
  },

  // Get filtered notifications
  getFilteredNotifications: async (userId, type = null, isRead = null, page = 0, size = 20) => {
    try {
      const params = { page, size };
      if (type) params.type = type;
      if (isRead !== null) params.isRead = isRead;
      
      const response = await api.get(`/v1/notifications/users/${userId}/filter`, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching filtered notifications:", error);
      throw error;
    }
  }
};