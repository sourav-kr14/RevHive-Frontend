import { useState, useEffect } from "react";
import api from "../../services/api";
import DashboardSidebar from "./UserSidebar";
import DashboardHeader from "./UserHeader";
import DashboardStats from "./UserStats";
import DashboardCompose from "./UserCompose";
import DashboardFeed from "./UserFeed";

export default function UserLayout() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [postText, setPostText] = useState("");

  // ✅ SAFE PARSE (prevents crash)
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // ✅ Fix: don't throw, handle gracefully
        if (!user || !user.id) {
          console.warn("User not found in localStorage");
          setLoading(false);
          return;
        }

        const response = await api.get(`/auth/profile/${user.id}`);
        setUserData(response.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.id]);

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
    username: user?.username || "User",
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex">
      <DashboardSidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        profileData={profileData}
      />

      <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
        <DashboardHeader profileData={profileData} />
        <DashboardStats profileData={profileData} />
        <DashboardCompose
          profileData={profileData}
          postText={postText}
          setPostText={setPostText}
        />
        <DashboardFeed profileData={profileData} />
      </div>
    </div>
  );
}
