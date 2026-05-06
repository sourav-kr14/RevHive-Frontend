import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { authAPI, followAPI } from "../../services/api";
import DashboardHeader from "./UserHeader";

export default function UserLayout() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("dashboard");

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

  if (loading) return <div className="text-white p-10">Loading...</div>;

  const profileData = userData || {
    id: user?.id,
    username: user?.username || "User",
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <DashboardHeader
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        profileData={profileData}
      />

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <Outlet context={{ profileData }} />
      </div>
    </div>
  );
}
