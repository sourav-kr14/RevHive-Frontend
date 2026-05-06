import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { authAPI, followAPI } from "../../services/api";
import DashboardHeader from "./UserHeader";

export default function UserLayout() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // sidebar feed state
  const [feedType, setFeedType] = useState("forYou");

  let user = null;

  try {
    const stored = localStorage.getItem("user");
    user = stored ? JSON.parse(stored) : null;
  } catch {
    user = null;
  }

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const profileRes = await authAPI.getProfile(user.id);

        const [followersRes, followingRes] = await Promise.all([
          followAPI.getFollowersCount(user.id),
          followAPI.getFollowingCount(user.id),
        ]);

        setUserData({
          ...profileRes.data,
          followersCount: followersRes.data.followersCount || 0,
          followingCount: followingRes.data.followingCount || 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.id]);

  if (loading) {
    return <div className="text-white p-10">Loading...</div>;
  }

  const profileData = userData || {
    id: user?.id,
    username: user?.username || "User",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f1a] to-[#070a12] text-white">
      {/* Header */}
      <DashboardHeader profileData={profileData} />

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64">
          <div className="sticky top-24">
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-5">
              <h2 className="text-lg font-semibold mb-5">Explore</h2>

              <div className="space-y-3">
                <button
                  onClick={() => setFeedType("forYou")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition ${
                    feedType === "forYou"
                      ? "bg-violet-600 text-white"
                      : "bg-white/5 hover:bg-white/10 text-gray-300"
                  }`}
                >
                  For You
                </button>

                <button
                  onClick={() => setFeedType("trending")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition ${
                    feedType === "trending"
                      ? "bg-violet-600 text-white"
                      : "bg-white/5 hover:bg-white/10 text-gray-300"
                  }`}
                >
                  Trending
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1">
          <Outlet
            context={{
              profileData,
              feedType,
            }}
          />
        </main>
      </div>
    </div>
  );
}
