import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Post from "../components/Post";
import api from "../services/api";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get user ID from localStorage (set during login)
  const user = JSON.parse(localStorage.getItem("user")) || {
    username: "User",
    id: null,
  };

  useEffect(() => {
    // Fetch user profile data when component mounts
    const fetchUserProfile = async () => {
      try {
        if (!user.id) {
          throw new Error("User ID not found");
        }

        const response = await api.get(`/auth/profile/${user.id}`);
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user.id]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
        <div>Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  const profileData = userData || {
    username: user.username,
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
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

        <button onClick={handleLogout} className="bg-red-600 py-2 rounded-lg w-full hover:bg-red-700 transition">
          Logout
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 p-8">

        {/* Top */}
        <h1 className="text-3xl font-bold">
          Welcome, {profileData.username} 👋
        </h1>

        {/* Stats - Display real data from database */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-blue-500/50 transition">
            <h3 className="text-gray-400 mb-2">Posts</h3>
            <p className="text-4xl font-bold">{profileData.postsCount || 0}</p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-blue-500/50 transition">
            <h3 className="text-gray-400 mb-2">Followers</h3>
            <p className="text-4xl font-bold">{profileData.followersCount || 0}</p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-blue-500/50 transition">
            <h3 className="text-gray-400 mb-2">Following</h3>
            <p className="text-4xl font-bold">{profileData.followingCount || 0}</p>
          </div>
        </div>

        {/* Create Post */}
        <div className="mt-10 bg-white/5 p-4 rounded-xl border border-white/10">
          <textarea
            className="w-full bg-transparent outline-none text-white placeholder-gray-600 resize-none"
            placeholder="What's on your mind?"
            rows="3"
          />
          <button className="mt-3 bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
            Post
          </button>
        </div>

        {/* Feed */}
        <div className="mt-8 space-y-6">

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <Post />
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <Post />
          </div>

        </div>

      </div>
    </div>
  );
}