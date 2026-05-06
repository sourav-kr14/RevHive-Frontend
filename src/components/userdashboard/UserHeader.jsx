import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function UserHeader({ activeNav, setActiveNav, profileData }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", path: "/user/dashboard" },
    { id: "profile", label: "Profile", path: "/user/profile" },
    { id: "settings", label: "Settings", path: "/user/settings" },
    { id: "messaging", label: "Messages", path: "/messages" },
    { id: "notification", label: "Notifications", path: "/notifications" },
  ];

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full h-16 bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="w-full px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/user/dashboard")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            src="/logo.png"
            alt="logo"
            className="w-10 h-10 rounded-full object-cover"
          />
          <h1 className="text-lg font-semibold text-gray-900">RevHive</h1>
        </motion.div>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = window.location.pathname === item.path;

            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  // setActiveNav(item.id);
                  navigate(item.path);
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`relative text-sm font-medium transition
                ${isActive ? "text-black" : "text-gray-500 hover:text-black hover:cursor-pointer"}`}
              >
                {item.label}

                {isActive && (
                  <motion.span
                    layoutId="underline"
                    className="absolute left-0 -bottom-1 h-[2px] w-full bg-black rounded"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Right Button */}
        {/* Right Buttons */}
        <motion.div
          className="hidden md:flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {profileData?.ispremium ? (
            <div
              className="px-4 py-2 rounded-xl 
    bg-gradient-to-r from-yellow-400 to-orange-500
    text-white text-sm font-semibold shadow-md"
            >
              Premium ⭐
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/premium")}
              className="px-4 py-2 rounded-xl 
    bg-gradient-to-r from-yellow-400 to-orange-500 
    text-white text-sm font-semibold shadow-md"
            >
              Upgrade ⭐
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/user/profile")}
            className="px-5 py-2 rounded-xl bg-black text-white text-sm font-medium shadow-sm"
          >
            @{profileData?.username || "User"}
          </motion.button>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </motion.button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden px-6 pb-4 flex flex-col gap-4 bg-white border-t overflow-hidden"
          >
            {navItems.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  setActiveNav(item.id);
                  navigate(item.path);
                  setOpen(false);
                }}
                className="text-left text-gray-700 text-sm"
              >
                {item.label}
              </motion.button>
            ))}

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                localStorage.clear();
                navigate("/signin");
              }}
              className="text-left text-red-500 text-sm"
            >
              Sign Out
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
