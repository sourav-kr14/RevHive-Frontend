import DashboardCompose from "./UserCompose";
import UserFeed from "./UserFeed";
import UserSidebar from "./UserSidebar";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function DashboardPage() {
  const { profileData } = useOutletContext();

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [feedType, setFeedType] = useState("forYou");

  console.log("✅ DashboardPage RENDERED - showing feed");

  const handlePostCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();

    navigate("/signin");
  };

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <UserSidebar
        feedType={feedType}
        setFeedType={setFeedType}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1">
        <DashboardCompose
          profileData={profileData}
          onPostCreated={handlePostCreated}
        />

        <UserFeed
          profileData={profileData}
          refreshTrigger={refreshTrigger}
          feedType={feedType}
        />
      </div>
    </div>
  );
}
