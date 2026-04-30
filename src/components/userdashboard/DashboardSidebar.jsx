import { useNavigate } from "react-router-dom";

export default function DashboardSidebar({ activeNav, setActiveNav, profileData }) {
  const navigate = useNavigate();

  const initials = profileData.username
    ? profileData.username.slice(0, 2).toUpperCase()
    : "RH";

  const navItems = [
    { id: "dashboard", label: "Dashboard", emoji: "🏠" },
    { id: "profile", label: "Profile", emoji: "👤" },
    { id: "settings", label: "Settings", emoji: "⚙️" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  return (
    <div className="w-64 bg-[#0c1120] p-6 flex flex-col justify-between border-r border-white/10 flex-shrink-0">
      <div className="flex flex-col gap-8">

        {/* Brand */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          RevHive
        </h2>

        {/* Avatar block */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">@{profileData.username}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
              <span className="text-xs text-gray-500">Active</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                  activeNav === item.id
                    ? "bg-blue-500/10 text-blue-300 font-medium"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{item.emoji}</span>
                <span>{item.label}</span>
                {activeNav === item.id && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleLogout}
        className="w-full py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm font-medium hover:bg-red-500/15 hover:border-red-500/40 transition-all"
      >
        ↩ Sign Out
      </button>
    </div>
  );
}

