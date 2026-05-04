// src/pages/NotificationsPage.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, MessageCircle, UserPlus, Share2, AtSign, 
  Trash2, CheckCheck, BellOff, ArrowLeft, RefreshCw
} from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { useNavigate } from 'react-router-dom';

export default function NotificationsPage({ currentUser }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.id) {
      fetchNotifications();
      fetchStats();
    }
  }, [currentUser]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getNotifications(currentUser.id, 0, 50);
      setNotifications(response.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await notificationService.getStatistics(currentUser.id);
      setStats(response.statistics);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    await notificationService.markAsRead(notificationId, currentUser.id);
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
    fetchStats();
  };

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead(currentUser.id);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    fetchStats();
  };

  const handleDelete = async (notificationId) => {
    if (window.confirm('Delete this notification?')) {
      await notificationService.deleteNotification(notificationId, currentUser.id);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      fetchStats();
    }
  };

  const getNotificationIcon = (type, size = 20) => {
    const icons = {
      LIKE: <Heart size={size} className="text-red-400" />,
      COMMENT: <MessageCircle size={size} className="text-blue-400" />,
      FOLLOW: <UserPlus size={size} className="text-green-400" />,
      SHARE: <Share2 size={size} className="text-purple-400" />,
      MENTION: <AtSign size={size} className="text-yellow-400" />
    };
    return icons[type] || <Heart size={size} className="text-gray-400" />;
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'recently';
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-400">Please log in to view notifications</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-700">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">Notifications</h1>
          {stats && (
            <p className="text-sm text-gray-400">
              {stats.unread || 0} unread · {stats.total || 0} total
            </p>
          )}
        </div>
        {notifications.some(n => !n.isRead) && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-3 py-1.5 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <CheckCheck size={14} />
            Mark all read
          </button>
        )}
        <button
          onClick={fetchNotifications}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20">
          <BellOff size={48} className="mx-auto mb-4 opacity-50 text-gray-500" />
          <p className="text-gray-400">No notifications yet</p>
          <p className="text-sm text-gray-500 mt-2">When you get notifications, they will appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-4 rounded-lg transition-all ${
                !notification.isRead
                  ? 'bg-blue-500/10 border border-blue-500/20'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type, 20)}
                </div>
                <div className="flex-1">
                  <p className="text-gray-200">
                    <span className="font-semibold">{notification.actorName || 'Someone'}</span>
                    {' '}{notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {getTimeAgo(notification.createdAt)}
                  </p>
                </div>
                <div className="flex gap-1">
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-1.5 hover:bg-white/10 rounded transition-colors"
                      title="Mark as read"
                    >
                      <CheckCheck size={14} className="text-blue-400" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="p-1.5 hover:bg-red-500/10 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}