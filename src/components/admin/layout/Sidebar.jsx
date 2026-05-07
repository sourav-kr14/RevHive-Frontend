import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, Crown, Search } from "lucide-react";
import { GoReport } from "react-icons/go";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  let user = { username: "Admin" };
  try {
    const stored = localStorage.getItem("user");
    user = stored ? JSON.parse(stored) : user;
  } catch {}

  const logout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  const navItems = [
    {
      name: "Search",
      path: "/admin/search",
      icon: Search,
    },
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Premium", path: "/admin/premium", icon: Crown },
    { name: "Reports", path: "/admin/reports", icon: GoReport },
  ];

  return (
    <div
      className="
  fixed md:relative z-50
  w-64 min-h-screen flex flex-col px-5 py-6
  bg-gradient-to-b from-[#0b0f1a] to-[#070a12]
  border-r border-white/10 backdrop-blur-xl
  transition-all duration-300
  "
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-10 h-10 rounded-xl 
        bg-gradient-to-br from-purple-500 to-blue-500 
        flex items-center justify-center text-white font-bold"
        >
          RH
        </div>
        <h1 className="text-lg font-semibold text-white">RevHive</h1>
      </div>

      {/* Nav */}
      <div className="flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition
              ${
                isActive
                  ? "text-white bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/30"
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
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-auto">
        <div className="mb-4 text-sm text-gray-400">@{user?.username}</div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 
          px-4 py-3 rounded-xl text-sm font-medium 
          text-red-400 bg-red-500/10 border border-red-500/20 
          hover:bg-red-500/20 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
