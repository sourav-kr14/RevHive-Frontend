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
    <div className="w-64 h-screen flex flex-col bg-white border-r px-3 py-4">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center font-bold">
          RH
        </div>
        <h2 className="text-sm font-semibold text-gray-800">RevHive</h2>
      </div>

      {/* Search */}
      <div className="mb-4 px-2">
        <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm">
          <Search size={16} className="text-gray-600" />
          <input
            placeholder="Search"
            className="bg-transparent outline-none text-sm flex-1 text-gray-800 placeholder-gray-400"
          />
          <span className="text-xs text-gray-500 font-medium">⌘K</span>
        </div>
      </div>

      {/* Profile */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex items-center gap-3 px-3 py-2 rounded-lg mb-4"
      >
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-sm">
          {initials}
        </div>

        <div>
          <p className="text-sm font-medium text-gray-800">
            @{profileData.username}
          </p>
          <span className="text-xs text-green-500">● Online</span>
        </div>
      </motion.div>

      {/* Navigation */}
      <ul className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;

          return (
            <li key={item.id}>
              <motion.button
                onClick={() => {
                  setActiveNav(item.id);
                  navigate(item.path);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                ${
                  isActive
                    ? "bg-gray-200 text-black"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {item.label}

                {isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-black" />
                )}
              </motion.button>
            </li>
          );
        })}
      </ul>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Logout */}
      <motion.button
        onClick={() => {
          localStorage.clear();
          navigate("/signin");
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50"
      >
        <LogOut size={16} />
        Sign Out
      </motion.button>
    </div>
  );
}
