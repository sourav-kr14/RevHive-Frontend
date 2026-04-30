import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user")) || {
    username: "Admin",
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
  ];

  return (
    <motion.div
      animate={{ width: collapsed ? 80 : 260 }}
      className="h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white p-4 flex flex-col border-r border-white/10 relative"
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 bg-gray-800 border border-white/10 rounded-full p-1 hover:bg-gray-700 transition"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Logo */}
      <motion.h1
        animate={{ opacity: collapsed ? 0 : 1 }}
        className="text-xl font-bold mb-10 px-2"
      >
        RevHive
      </motion.h1>

      {/* Navigation */}
      <div className="flex flex-col gap-2 relative">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link key={item.name} to={item.path} className="relative">
              {/* Sliding Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl relative z-10 transition-all ${
                  isActive ? "shadow-md" : "hover:bg-white/5"
                }`}
              >
                <Icon size={20} />

                {!collapsed && <span className="font-medium">{item.name}</span>}
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="mt-auto flex flex-col gap-4">
        {/* Profile */}
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center font-bold">
            {user.username.slice(0, 2).toUpperCase()}
          </div>

          {!collapsed && (
            <div>
              <p className="text-sm font-semibold">{user.username}</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          )}
        </div>

        {/* Logout */}
        <motion.button
          onClick={logout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 bg-red-500/90 hover:bg-red-600 px-3 py-2 rounded-xl font-semibold transition"
        >
          <LogOut size={18} />
          {!collapsed && "Logout"}
        </motion.button>
      </div>
    </motion.div>
  );
}
