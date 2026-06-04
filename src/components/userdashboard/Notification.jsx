import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Check,
  CheckCheck,
  Heart,
  User,
  MessageSquare,
  Sparkles,
  Info,
  Calendar,
  Clock,
} from "lucide-react";
import { connectWebSocket, disconnectWebSocket } from "@/services/webSocket";
import { toast } from "sonner";
import { notificationAPI } from "@/services/api";

export default function Notification() {
  const { profileData } = useOutletContext();
  const userId = profileData?.id;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial notifications
  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await notificationAPI.getNotifications(0, 50);

      const data = res.data?.data || res.data || [];

      const sorted = [...data].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setNotifications(sorted);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  // WebSocket Subscription
  useEffect(() => {
    if (!userId) return;

    const token = localStorage.getItem("token");

    const handleIncomingNotification = (newNotif) => {
      toast.info(
        <div className="flex flex-col gap-1">
          <span className="font-bold text-slate-900">{newNotif.title}</span>
          <span className="text-xs text-slate-600">{newNotif.message}</span>
        </div>,
        {
          icon: <Bell className="text-violet-600 h-4 w-4" />,
          duration: 5000,
        },
      );

      // Prepend new notification to the state list
      setNotifications((prev) => [newNotif, ...prev]);
    };

    connectWebSocket(token, "notification", handleIncomingNotification);

    return () => {
      disconnectWebSocket("notification", handleIncomingNotification);
    };
  }, [userId]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif,
        ),
      );
      toast.success("Notification marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Could not update notification");
    }
  };

  const handleMarkAllAsRead = async () => {
    if (notifications.filter((n) => !n.read).length === 0) {
      toast.info("All notifications are already read");
      return;
    }
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true })),
      );
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all read:", error);
      toast.error("Could not update notifications");
    }
  };

  // Helper to resolve icon by notification type/title
  const getNotificationIcon = (notif) => {
    const type = notif.type || "";
    const title = (notif.title || "").toLowerCase();
    const iconClass = "w-5 h-5";

    if (type === "LIKE" || title.includes("like")) {
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
          <Heart className={iconClass} fill="currentColor" />
        </div>
      );
    }
    if (type === "COMMENT" || title.includes("comment")) {
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <MessageSquare className={iconClass} />
        </div>
      );
    }
    if (type === "FOLLOW" || title.includes("follow")) {
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <User className={iconClass} />
        </div>
      );
    }
    if (title.includes("congrat") || title.includes("premium")) {
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <Sparkles className={iconClass} />
        </div>
      );
    }
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
        <Info className={iconClass} />
      </div>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-4xl px-2 py-4"
    >
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Stay updated with your profile likes, comments, and connection
            events
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-98"
          >
            <CheckCheck size={16} />
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800"></div>
          <span className="mt-3 text-sm font-medium text-slate-500">
            Loading your feed...
          </span>
        </div>
      ) : notifications.length === 0 ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white py-16 px-4 shadow-sm text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400">
            <Bell size={28} />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-950">
            All quiet for now
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-xs">
            We will alert you here when someone likes your posts or follows your
            profile.
          </p>
        </motion.div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="divide-y divide-slate-100">
            <AnimatePresence initial={false}>
              {notifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-start gap-4 p-5 transition hover:bg-slate-50/50 ${
                    !notif.read ? "bg-slate-50/40" : ""
                  }`}
                >
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notif)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {notif.title}
                        </h4>
                        <p className="mt-0.5 text-sm text-slate-600 break-words leading-relaxed">
                          {notif.message}
                        </p>
                      </div>

                      {!notif.read && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-800"
                          title="Mark as read"
                        >
                          <Check size={14} />
                        </button>
                      )}
                    </div>

                    <div className="mt-2.5 flex items-center gap-4 text-xs font-semibold text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatDate(notif.createdAt)}
                      </span>
                      {!notif.read && (
                        <span className="flex items-center gap-1 text-indigo-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                          Unread
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
}
