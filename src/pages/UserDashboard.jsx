import { useNavigate } from "react-router-dom";
import Post from "../components/Post";

export default function UserDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {
    username: "Tanu",
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex">

      {/* Sidebar */}
      <div className="w-64 bg-[#0f172a] p-6 flex flex-col justify-between border-r border-white/10">
        <div>
          <h2 className="text-2xl font-bold mb-10 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            RevHive
          </h2>

          <ul className="space-y-6 text-gray-400">
            <li>🏠 Dashboard</li>
            <li>👤 Profile</li>
            <li>⚙️ Settings</li>
          </ul>
        </div>

        <button onClick={handleLogout} className="bg-red-600 py-2 rounded-lg">
          Logout
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 p-8">

        {/* Top */}
        <h1 className="text-3xl font-bold">
          Welcome, {user.username} 👋
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="bg-white/5 p-6 rounded-xl">
            <h3>Posts</h3>
            <p className="text-2xl">12</p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl">
            <h3>Followers</h3>
            <p className="text-2xl">340</p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl">
            <h3>Following</h3>
            <p className="text-2xl">180</p>
          </div>
        </div>

        {/* Create */}
        <div className="mt-10 bg-white/5 p-4 rounded-xl">
          <textarea className="w-full bg-transparent outline-none" />
          <button className="mt-3 bg-blue-600 px-4 py-2 rounded-lg">
            Post
          </button>
        </div>

        {/* Feed */}
        <div className="mt-8 space-y-6">

          <div className="bg-white/5 p-4 rounded-xl">
            <Post />
          </div>

          <div className="bg-white/5 p-4 rounded-xl">
            <Post />
          </div>

        </div>

      </div>
    </div>
  );
}