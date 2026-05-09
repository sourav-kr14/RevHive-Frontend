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
import { useState } from "react";

export default function UserHeader({ activeNav, setActiveNav, profileData }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

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
      path: "/notifications",
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
                className={`relative flex h-full items-center gap-2 px-4 text-sm font-semibold transition ${
                  isActive
                    ? "text-slate-950"
                    : "text-slate-500 hover:text-slate-950"
                }`}
              >
                <Icon size={17} />
                {item.label}

                {isActive && (
                  <motion.span
                    layoutId="headerActiveLine"
                    className="absolute bottom-0 left-4 right-4 h-[3px] rounded-t-full bg-slate-950"
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

          {profileData?.ispremium ? (
            <div className="flex h-10 items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 text-sm font-bold text-amber-700">
              <Crown size={16} />
              Premium
            </div>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/premium")}
              className="flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              <Crown size={16} />
              Upgrade
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate("/user/profile")}
            className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 pr-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
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
                    {profileData?.ispremium ? "Premium member" : "Free member"}
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
                      <Icon size={18} />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 space-y-2">
                {!profileData?.ispremium && (
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
