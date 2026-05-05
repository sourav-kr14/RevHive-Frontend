import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function UserHeader({ activeNav, setActiveNav, profileData }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", path: "/" },
    { id: "profile", label: "Profile", path: "/profile" },
    { id: "settings", label: "Settings", path: "/settings" },
    { id: "messaging", label: "Messages", path: "/messages" },
    { id: "notification", label: "Notifications", path: "/notifications" },
  ];

  return (
    <header className="w-full h-16 bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            src="/logo.png"
            alt="RevHive Logo"
            className="w-10 h-10 rounded-full object-cover"
          />
          <h1 className="text-lg font-semibold text-gray-900">RevHive</h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  navigate(item.path);
                }}
                className={`text-sm font-medium transition 
                ${isActive ? "text-black" : "text-gray-500 hover:text-black hover:cursor-pointer"}`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Button */}
        <div className="hidden md:block">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/profile")}
            className="px-5 py-2 rounded-xl bg-black text-white text-sm font-medium"
          >
            @{profileData?.username || "User"}
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-4 bg-white border-t">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id);
                navigate(item.path);
                setOpen(false);
              }}
              className="text-left text-gray-700 text-sm"
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={() => {
              localStorage.clear();
              navigate("/signin");
            }}
            className="text-left text-red-500 text-sm"
          >
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
}
