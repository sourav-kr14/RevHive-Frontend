import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Home,
  User,
  Settings,
  LogOut,
  MessageCircle,
  Search,
} from "lucide-react";

export default function UserSidebar({ activeNav, setActiveNav, profileData }) {
  const navigate = useNavigate();

  const initials = profileData?.username
    ? profileData.username.slice(0, 2).toUpperCase()
    : "RH";

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/" },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
    {
      id: "messaging",
      label: "Messages",
      icon: MessageCircle,
      path: "/messages",
    },
  ];

  return (
    <div
      className="w-72 h-screen flex flex-col px-5 py-6 
    bg-gradient-to-b from-[#0b0f1a] to-[#070a12] 
    border-r border-white/10 backdrop-blur-xl"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-10 h-10 rounded-xl 
        bg-gradient-to-br from-purple-500 to-blue-500 
        flex items-center justify-center font-bold text-white shadow-lg"
        >
          RH
        </div>
        <h2 className="text-lg font-semibold text-white tracking-tight">
          RevHive
        </h2>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl 
        bg-white/5 border border-white/10 backdrop-blur-md
        focus-within:ring-1 focus-within:ring-purple-500 transition"
        >
          <Search size={16} className="text-gray-400" />
          <input
            placeholder="Search..."
            className="bg-transparent outline-none text-sm flex-1 text-white placeholder-gray-500"
          />
          <span className="text-xs text-gray-500">⌘K</span>
        </div>
      </div>

      {/* Profile */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex items-center gap-3 px-3 py-3 rounded-xl mb-6
        bg-white/5 border border-white/10 backdrop-blur-md cursor-pointer"
      >
        <div
          className="w-11 h-11 rounded-full 
        bg-gradient-to-br from-purple-500 to-blue-500 
        flex items-center justify-center text-white font-semibold shadow"
        >
          {initials}
        </div>

        <div>
          <p className="text-sm font-semibold text-white">
            @{profileData?.username}
          </p>
          <span className="text-xs text-green-400">● Online</span>
        </div>
      </motion.div>

      {/* Navigation */}
      <ul className="flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;

          return (
            <li key={item.id}>
              <motion.button
                onClick={() => {
                  setActiveNav && setActiveNav(item.id);
                  navigate(item.path);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${
                  isActive
                    ? "text-white bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/30 shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {/* Active Indicator */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 
                  bg-gradient-to-b from-purple-500 to-blue-500 rounded-r-full"
                  />
                )}

                <Icon size={18} />
                {item.label}
              </motion.button>
            </li>
          );
        })}
      </ul>

      <div className="flex-1" />

      {/* Logout */}
      <motion.button
        onClick={() => {
          localStorage.clear();
          navigate("/signin");
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl 
        text-sm font-medium text-red-400 
        bg-red-500/10 border border-red-500/20 
        hover:bg-red-500/20 transition"
      >
        <LogOut size={16} />
        Sign Out
      </motion.button>
    </div>
  );
}
