import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Menu, X, Bell, Settings, Zap, Search } from "lucide-react";
import { useState } from "react";

export default function UserHeader({ activeNav, setActiveNav, profileData }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home", path: "/" },
    { id: "dashboard", label: "Dashboard", path: "/user/dashboard" },
    { id: "projects", label: "Projects", path: "/projects" },
    { id: "tasks", label: "Tasks", path: "/tasks" },
    { id: "reporting", label: "Reporting", path: "/reporting" },
    { id: "users", label: "Users", path: "/users" },
  ];

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md"
    >
      <div className="h-20 px-8 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-10">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow">
              <span className="text-white font-bold text-lg">R</span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900">RevHive</h1>
          </motion.div>

          {/* NAV */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeNav === item.id;

              return (
                <motion.button
                  key={item.id}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setActiveNav(item.id);
                    navigate(item.path);
                  }}
                  className={`px-5 py-3 rounded-xl text-[15px] font-semibold transition-all
                  ${
                    isActive
                      ? "bg-gray-100 text-black shadow-sm"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  {item.label}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* RIGHT */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Upgrade */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-3 border border-gray-300 rounded-2xl bg-white shadow-sm hover:bg-gray-50 transition"
          >
            <Zap size={17} />
            <span className="font-semibold text-sm">Upgrade now</span>
          </motion.button>

          {/* Search */}
          <button className="p-3 rounded-xl hover:bg-gray-100 transition">
            <Search size={20} className="text-gray-500" />
          </button>

          {/* Settings */}
          <button
            onClick={() => navigate("/settings")}
            className="p-3 rounded-xl hover:bg-gray-100 transition"
          >
            <Settings size={20} className="text-gray-500" />
          </button>

          {/* Notification */}
          <div className="relative">
            <button
              onClick={() => navigate("/notifications")}
              className="p-3 rounded-xl hover:bg-gray-100 transition"
            >
              <Bell size={20} className="text-gray-500" />
            </button>

            <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px] font-bold">
              2
            </div>
          </div>

          {/* Profile */}
          <motion.img
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/user/profile")}
            src={profileData?.profilePicture || "https://i.pravatar.cc/100"}
            alt="profile"
            className="w-11 h-11 rounded-full object-cover cursor-pointer border border-gray-200"
          />
        </div>

        {/* MOBILE */}
        <button onClick={() => setOpen(!open)} className="lg:hidden">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t bg-white"
          >
            <div className="flex flex-col gap-2 p-5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    navigate(item.path);
                    setOpen(false);
                  }}
                  className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition
                  ${
                    activeNav === item.id
                      ? "bg-gray-100 text-black"
                      : "text-gray-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
