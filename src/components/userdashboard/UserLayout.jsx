import { useState, useEffect } from "react";
import api from "../services/api";
import DashboardSidebar from "../components/userdashboard/DashboardSidebar";
import DashboardHeader from "../components/userdashboard/DashboardHeader";
import DashboardStats from "../components/userdashboard/DashboardStats";
import DashboardCompose from "../components/userdashboard/DashboardCompose";
import DashboardFeed from "../components/userdashboard/DashboardFeed";

export default function UserDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [postText, setPostText] = useState("");

  const user = JSON.parse(localStorage.getItem("user")) || {
    username: "User",
    id: null,
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!user.id) throw new Error("User ID not found");
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
