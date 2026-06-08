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
} from "lucide-react";
import { useState, useEffect } from "react";
import { notificationAPI } from "../../services/api";
import {
  connectWebSocket,
  disconnectWebSocket,
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
  const [hasNewMessage, setHasNewMessage] = useState(
    localStorage.getItem("unread_messages") === "true",
  );

  useEffect(() => {
    if (location.pathname.startsWith("/messages")) {
      localStorage.removeItem("unread_messages");
      setHasNewMessage(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!token) return;

    let currentUserId = null;
    try {
      currentUserId = JSON.parse(localStorage.getItem("user"))?.id;
    } catch {}

    const handleIncomingMessage = (msg) => {
      if (
        msg &&
        msg.receiverId === currentUserId &&
        msg.senderId !== currentUserId
      ) {
        if (!location.pathname.startsWith("/messages")) {
          localStorage.setItem("unread_messages", "true");
          setHasNewMessage(true);
        }
      }
    };

    connectWebSocket(token, "chat", handleIncomingMessage);

    return () => {
      disconnectWebSocket("chat", handleIncomingMessage);
    };
  }, [token, location.pathname]);

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
                  {item.id === "messaging" && hasNewMessage && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse" />
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
          <div className="relative w-[220px] xl:w-[280px]">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search RevHive"
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
            />
          </div>

          {userIsPremium ? (
            <button
              className="
    relative overflow-hidden
    rounded-2xl border border-yellow-400/30
    bg-white/10 backdrop-blur-xl
    px-5 py-2.5
    text-sm font-semibold text-yellow-300
    shadow-[0_8px_32px_rgba(250,204,21,0.18)]
    transition-all duration-300
    hover:scale-[1.03]
    hover:bg-yellow-400/10
    hover:shadow-[0_12px_40px_rgba(250,204,21,0.28)]
  "
            >
              <span className="flex items-center gap-2 text-black font-medium">
                Premium
              </span>

              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-white/5 to-yellow-300/10" />
            </button>
          ) : (
            <button
              onClick={() => navigate("/premium")}
              className="
    relative overflow-hidden
    rounded-2xl border border-white/10
    bg-white/10 backdrop-blur-xl
    px-5 py-2.5
    text-sm font-semibold text-white
    shadow-[0_8px_32px_rgba(139,92,246,0.22)]
    transition-all duration-300
    hover:scale-[1.03]
    hover:border-purple-400/30
    hover:bg-white/15
    hover:shadow-[0_12px_40px_rgba(139,92,246,0.35)]
  "
            >
              <span className="relative z-10 flex items-center gap-2">
                Upgrade
              </span>

              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/10 to-cyan-400/20" />
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate("/user/profile")}
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
            <ChevronDown size={15} className="text-slate-400" />
          </button>
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
                        {item.id === "messaging" && hasNewMessage && (
                          <span className="absolute -right-1 -top-1 flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse" />
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
