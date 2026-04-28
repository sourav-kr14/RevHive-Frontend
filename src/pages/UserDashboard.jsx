import { useNavigate } from "react-router-dom";

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
            <li className="hover:text-white cursor-pointer">🏠 Dashboard</li>
            <li className="hover:text-white cursor-pointer">👤 Profile</li>
            <li className="hover:text-white cursor-pointer">⚙️ Settings</li>
          </ul>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">

        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            Welcome, {user.username} 👋
          </h1>

          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-8">

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h3 className="text-gray-400">Posts</h3>
            <p className="text-2xl font-bold mt-2">12</p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h3 className="text-gray-400">Followers</h3>
            <p className="text-2xl font-bold mt-2">340</p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h3 className="text-gray-400">Following</h3>
            <p className="text-2xl font-bold mt-2">180</p>
          </div>

        </div>

        {/* Create Post */}
        <div className="mt-10 bg-white/5 p-4 rounded-xl border border-white/10">
          <textarea
            placeholder="What's on your mind?"
            className="w-full bg-transparent outline-none text-white resize-none"
          />
          <button className="mt-3 bg-blue-600 px-4 py-2 rounded-lg">
            Post
          </button>
        </div>

        {/* Feed */}
        <div className="mt-8 space-y-6">

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h2 className="font-semibold">First Post</h2>
            <p className="text-gray-400 mt-2">
              This is your dashboard feed UI 🔥
            </p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h2 className="font-semibold">Another Post</h2>
            <p className="text-gray-400 mt-2">
              Clean modern UI ready for backend integration 🚀
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}