import { useState, useEffect } from "react";
import { authAPI, followAPI } from "../../services/api";

import DashboardSidebar from "./UserSidebar";
import DashboardHeader from "./UserHeader";
import DashboardStats from "./UserStats";
import DashboardCompose from "./UserCompose";
import DashboardFeed from "./UserFeed";

export default function UserLayout() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeNav, setActiveNav] = useState("dashboard");

  // ✅ safe localStorage parsing
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
      } catch {
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.id]);

  const handlePostCreated = () => {
    setRefreshTrigger((prev) => prev + 1);

    setUserData((prev) =>
      prev ? { ...prev, postsCount: (prev.postsCount || 0) + 1 } : prev,
    );
  };

  // Loading
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center 
      bg-gradient-to-b from-[#0b0f1a] to-[#070a12] text-gray-400"
      >
        Loading profile...
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center 
      bg-gradient-to-b from-[#0b0f1a] to-[#070a12] text-red-400"
      >
        {error}
      </div>
    );
  }

  const profileData = userData || {
    id: user?.id,
    username: user?.username || "User",
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
  };

  return (
    <div
      className="min-h-screen flex 
    bg-gradient-to-b from-[#0b0f1a] to-[#070a12] text-white"
    >
      {/* Sidebar */}
      <DashboardSidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        profileData={profileData}
      />

      {/* Main */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-5xl px-6 py-6 flex flex-col gap-6">
          <DashboardHeader profileData={profileData} />

          <DashboardStats profileData={profileData} />

          <DashboardCompose
            profileData={profileData}
            onPostCreated={handlePostCreated}
          />

          <DashboardFeed
            profileData={profileData}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>
    </div>
  );
}
