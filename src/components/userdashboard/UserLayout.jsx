// components/userdashboard/UserLayout.jsx - Update to fetch real stats
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
        
        // Fetch profile
        const response = await authAPI.getProfile(user.id);
        
        // Fetch follow counts
        const [followersRes, followingRes] = await Promise.all([
          followAPI.getFollowersCount(user.id),
          followAPI.getFollowingCount(user.id)
        ]);
        
        setUserData({
          ...response.data,
          followersCount: followersRes.data.followersCount || 0,
          followingCount: followingRes.data.followingCount || 0
        });
        
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user?.id]);

  const handlePostCreated = (newPost) => {
    setRefreshTrigger(prev => prev + 1);
    if (userData) {
      setUserData({
        ...userData,
        postsCount: (userData.postsCount || 0) + 1
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
        <div className="text-gray-400">Loading profile...</div>
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
    id: user?.id,
    username: user?.username || "User",
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex">
      <DashboardSidebar profileData={profileData} />
      
      <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
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
  );
}