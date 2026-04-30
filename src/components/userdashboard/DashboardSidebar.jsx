import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home, User, Settings, LogOut, Sparkles } from "lucide-react";

export default function DashboardSidebar({
  activeNav,
  setActiveNav,
  profileData,
}) {
  const navigate = useNavigate();

  const initials = profileData.username
    ? profileData.username.slice(0, 2).toUpperCase()
    : "RH";

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  return (
    <div className="relative w-72 h-screen p-6 flex flex-col justify-between bg-white/5 backdrop-blur-2xl border-r border-white/10">
      {/* Glow Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 via-transparent to-blue-600/10 pointer-events-none" />

      <div className="relative flex flex-col gap-8">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-400" size={18} />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            RevHive
          </h2>
        </div>

        {/* Avatar Block */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xl"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold shadow-lg shadow-purple-500/20">
            {initials}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">
              @{profileData.username}
            </p>

            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs text-gray-500">Active</span>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <ul className="flex flex-col gap-2">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            return (
              <li key={item.id}>
                <motion.button
                  onClick={() => setActiveNav(item.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                    isActive ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {/* Active Glow */}
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-blue-500/30"
                    />
                  )}

                  {/* Icon */}
                  <Icon
                    size={18}
                    className={`relative z-10 ${
                      isActive ? "text-blue-400" : ""
                    }`}
                  />

                  {/* Label */}
                  <span className="relative z-10">{item.label}</span>

                  {/* Active Dot */}
                  {isActive && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-blue-400 relative z-10 shadow-md shadow-blue-500/50" />
                  )}
                </motion.button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Logout */}
      <motion.button
        onClick={handleLogout}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-full py-3 rounded-xl text-sm font-semibold overflow-hidden"
      >
        {/* Gradient */}
        <span className="absolute inset-0 bg-gradient-to-r from-red-600/80 to-pink-600/80 opacity-90" />

        {/* Glow */}
        <span className="absolute inset-0 blur-lg bg-red-500/40 opacity-40" />

        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2 text-white">
          <LogOut size={16} />
          Sign Out
        </span>
      </motion.button>
    </div>
  );
}
