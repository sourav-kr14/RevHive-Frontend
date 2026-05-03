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

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!user?.id) {
          setLoading(false);
          return;
        }

        const response = await authAPI.getProfile(user.id);

        const [followersRes, followingRes] = await Promise.all([
          followAPI.getFollowersCount(user.id),
          followAPI.getFollowingCount(user.id),
        ]);

        setUserData({
          ...response.data,
          followersCount: followersRes.data.followersCount || 0,
          followingCount: followingRes.data.followingCount || 0,
        });
      } catch (err) {
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.id]);

  const handlePostCreated = () => {
    setRefreshTrigger((prev) => prev + 1);

    if (userData) {
      setUserData({
        ...userData,
        postsCount: (userData.postsCount || 0) + 1,
      });
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <DashboardSidebar profileData={profileData} />

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
