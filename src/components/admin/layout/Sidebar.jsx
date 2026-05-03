import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, LogOut } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {
    username: "Admin",
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col p-4">
      <h1 className="text-lg font-semibold mb-6">RevHive</h1>

      <div className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                isActive
                  ? "bg-gray-200 text-black"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg text-sm"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
