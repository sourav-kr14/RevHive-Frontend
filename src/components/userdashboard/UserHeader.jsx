import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Crown,
  User,
  Bell,
  MessageCircle,
  Settings,
  LayoutDashboard,
  LogOut,
  Search,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { notificationAPI, chatAPI } from "../../services/api";
import {
  connectWebSocket,
  disconnectWebSocket,
  closeWebSocket,
} from "../../services/webSocket";

export default function UserHeader({ setActiveNav, profileData }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");

  let isPremium = false;

  if (
    token &&
    token !== "undefined" &&
    token !== "null" &&
    token.trim() !== ""
  ) {
    try {
      const base64Url = token.split(".")[1];
      if (base64Url) {
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const pad = base64.length % 4;
        const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
        const payload = JSON.parse(atob(padded));
        isPremium = payload.premium === true;
      }
    } catch (e) {
      console.log("Error decoding token in header:", e);
    }
  }

  const userIsPremium =
    isPremium ||
    profileData?.premium === true ||
    profileData?.ispremium === true ||
    profileData?.isPremium === true;

  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch initial unread count on mount
  useEffect(() => {
    if (!token) return;

    let currentUserId = null;
    try {
      currentUserId = JSON.parse(localStorage.getItem("user"))?.id;
    } catch {}

    if (!currentUserId) return;

    const fetchInitialUnread = async () => {
      try {
        const convRes = await chatAPI.getConversations(currentUserId);
        const conversations = convRes.data?.data || convRes.data || [];
        const totalUnread = conversations.reduce(
          (acc, c) => acc + (c.unreadCount || 0),
          0,
        );
        setUnreadMessagesCount(totalUnread);
      } catch (err) {
        console.error("Failed to fetch initial unread messages count:", err);
      }
    };

    fetchInitialUnread();
  }, [token]);

  // Sync unread messages count with ChatList when it updates
  useEffect(() => {
    const handleUpdate = (e) => {
      if (typeof e.detail?.count === "number") {
        setUnreadMessagesCount(e.detail.count);
      }
    };
    window.addEventListener("unread-count-updated", handleUpdate);
    return () =>
      window.removeEventListener("unread-count-updated", handleUpdate);
  }, []);

  // WebSocket real-time updates for unread count when NOT on /messages
  useEffect(() => {
    if (!token) return;

    let currentUserId = null;
    try {
      currentUserId = JSON.parse(localStorage.getItem("user"))?.id;
    } catch {}

    if (!currentUserId) return;

    const handleIncomingMessage = (msg) => {
      if (
        msg &&
        msg.receiverId === currentUserId &&
        msg.senderId !== currentUserId
      ) {
        if (!location.pathname.startsWith("/messages")) {
          setUnreadMessagesCount((prev) => prev + 1);
        }
      }
    };

    connectWebSocket(token, "chat", handleIncomingMessage);

    return () => {
      disconnectWebSocket("chat", handleIncomingMessage);
    };
  }, [token, location.pathname]);

  // WebSocket real-time updates for unread notifications count
  useEffect(() => {
    if (!token) return;

    let currentUserId = null;
    try {
      currentUserId = JSON.parse(localStorage.getItem("user"))?.id;
    } catch {}

    if (!currentUserId) return;

    const handleIncomingNotification = (newNotif) => {
      if (newNotif && newNotif.userId === currentUserId && !newNotif.read) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    connectWebSocket(token, "notification", handleIncomingNotification);

    return () => {
      disconnectWebSocket("notification", handleIncomingNotification);
    };
  }, [token]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await notificationAPI.getNotifications();
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        const unread = list.filter((n) => !n.read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.log("Failed to fetch notification count", err);
      }
    };

    if (token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/user/dashboard",
      icon: LayoutDashboard,
    },
    { id: "profile", label: "Profile", path: "/user/profile", icon: User },
    {
      id: "messaging",
      label: "Messages",
      path: "/messages",
      icon: MessageCircle,
    },
    {
      id: "notification",
      label: "Notifications",
      path: "/user/notifications",
      icon: Bell,
    },
    {
      id: "settings",
      label: "Settings",
      path: "/user/settings",
      icon: Settings,
    },
  ];

  const userName = profileData?.username || "User";
  const avatarUrl = profileData?.avatarUrl || profileData?.avatar || "";

  const handleNavigate = (item) => {
    setActiveNav?.(item.id);
    navigate(item.path);
    setOpen(false);
  };

  const handleSignOut = () => {
    localStorage.clear();
    sessionStorage.clear();
    try {
      closeWebSocket();
    } catch (err) {
      console.error("Failed to close WebSocket on logout:", err);
    }
    navigate("/signin");
  };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white"
    >
      <div className="flex h-[72px] w-full items-center justify-between px-5 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("/user/dashboard")}
          className="flex min-w-[210px] items-center gap-3"
        >
          <img
            src="/logo.png"
            alt="RevHive"
            className="h-11 w-11 rounded-xl object-cover ring-1 ring-slate-200"
          />

          <div className="text-left">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-950">
              RevHive
            </h1>
            <p className="text-xs font-medium text-slate-500">Social network</p>
          </div>
        </button>

        <nav className="hidden h-full items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item)}
                className={`relative flex h-full items-center gap-2 px-4 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-indigo-600"
                    : "text-slate-500 hover:text-indigo-600"
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <Icon size={17} />
                  {item.id === "notification" && unreadCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse" />
                  )}
                  {item.id === "messaging" && unreadMessagesCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex min-w-4 h-4 px-1 rounded-full bg-rose-500 text-[9px] font-bold text-white items-center justify-center ring-2 ring-white shadow-[0_0_8px_rgba(244,63,94,0.8)]">
                      {unreadMessagesCount > 99 ? "99+" : unreadMessagesCount}
                    </span>
                  )}
                </div>
                {item.label}

                {isActive && (
                  <motion.span
                    layoutId="headerActiveLine"
                    className="absolute bottom-0 left-4 right-4 h-[3px] rounded-t-full bg-gradient-to-r from-purple-600 to-indigo-600"
                  />
                )}
              </button>
            );
          })}
        </nav>
        <div className="hidden min-w-[360px] items-center justify-end gap-3 lg:flex">
          {/* <div className="relative w-[220px] xl:w-[280px]">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search RevHive"
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
            />
          </div> */}
          {userIsPremium ? (
            <button
              className="
      group relative overflow-hidden
      rounded-4xl p-[1px]
    border-2 border-gray-100
 
      transition-all duration-300
      hover:scale-105
    "
            >
              <div
                className="
        flex items-center gap-2
        rounded-xl
        bg-white
        px-2.5 py-2
      "
              >
                <Crown size={16} className="text-red-700" />

                <span className="font-semibold text-black">Premium Active</span>

                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              </div>

              <div className="absolute inset-0 -z-10 bg-yellow-400/20 blur-xl" />
            </button>
          ) : (
            <button
              onClick={() => navigate("/premium")}
              className="
      group relative overflow-hidden
      rounded-xl p-[1px]
      bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500
      shadow-[0_10px_35px_rgba(139,92,246,0.35)]
      transition-all duration-300
      hover:scale-105
      hover:shadow-[0_15px_50px_rgba(139,92,246,0.5)]
    "
            >
              <div
                className="
        relative flex items-center gap-2
        rounded-xl
        bg-[#0f172a]
        px-5 py-2.5
      "
              >
                <Sparkles
                  size={16}
                  className="text-violet-400 transition-transform group-hover:rotate-12"
                />

                <span className="font-semibold text-white">Upgrade Pro</span>

                <span
                  className="
          rounded-full
          bg-violet-500/15
          px-2 py-0.5
          text-[10px]
          font-bold
          uppercase
          tracking-wider
          text-violet-300
        "
                >
                  New
                </span>
              </div>

              <div
                className="
        absolute inset-0
        translate-x-[-100%]
        bg-gradient-to-r
        from-transparent
        via-white/20
        to-transparent
        transition-transform
        duration-1000
        group-hover:translate-x-[100%]
      "
              />
            </button>
          )}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex h-10 items-center gap-2 rounded-xl border border-slate-200/85 bg-white px-2 pr-3 text-sm font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-50/80 hover:shadow hover:scale-[1.01] duration-200"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userName}
                  className="h-8 w-8 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}

              <span className="max-w-[110px] truncate">@{userName}</span>
              <ChevronDown
                size={15}
                className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-200/80 bg-white/90 p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl z-50 flex flex-col gap-0.5"
                >
                  <button
                    onClick={() => {
                      navigate("/user/profile");
                      setDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors duration-200"
                  >
                    <User size={16} className="text-slate-500" />
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      navigate("/user/settings");
                      setDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors duration-200"
                  >
                    <Settings size={16} className="text-slate-500" />
                    Settings
                  </button>
                  {/* 
                  <button
                    onClick={() => {
                      navigate("/premium");
                      setDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors duration-200"
                  >
                    <Crown size={16} className="text-amber-500" />
                    Premium
                  </button> */}

                  <div className="h-px bg-slate-100 my-1" />

                  <button
                    onClick={() => {
                      handleSignOut();
                      setDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50/80 transition-colors duration-200"
                  >
                    <LogOut size={16} className="text-rose-500" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-0 z-[60] bg-white lg:hidden"
          >
            <div className="flex h-[72px] items-center justify-between border-b border-slate-200 px-5">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="RevHive"
                  className="h-11 w-11 rounded-xl object-cover ring-1 ring-slate-200"
                />
                <div>
                  <h2 className="text-lg font-extrabold text-slate-950">
                    RevHive
                  </h2>
                  <p className="text-xs text-slate-500">Social network</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <div className="px-5 py-5">
              <div className="mb-5 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={userName}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-950">
                    @{userName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {userIsPremium ? "Premium member" : "Free member"}
                  </p>
                </div>
              </div>

              <div className="relative mb-5">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search RevHive"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none"
                />
              </div>

              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavigate(item)}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold ${
                        isActive
                          ? "bg-slate-950 text-white"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="relative flex items-center justify-center">
                        <Icon size={18} />
                        {item.id === "notification" && unreadCount > 0 && (
                          <span className="absolute -right-1 -top-1 flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse" />
                        )}
                        {item.id === "messaging" && unreadMessagesCount > 0 && (
                          <span className="absolute -right-2 -top-2 flex min-w-4 h-4 px-1 rounded-full bg-rose-500 text-[9px] font-bold text-white items-center justify-center ring-2 ring-white shadow-[0_0_8px_rgba(244,63,94,0.8)]">
                            {unreadMessagesCount > 99
                              ? "99+"
                              : unreadMessagesCount}
                          </span>
                        )}
                      </div>
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 space-y-2">
                {!userIsPremium && (
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/premium");
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-sm font-bold text-white"
                  >
                    <Crown size={17} />
                    Upgrade to Premium
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-3 text-sm font-bold text-red-600"
                >
                  <LogOut size={17} />
                  Sign out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
