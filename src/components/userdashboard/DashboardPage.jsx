import DashboardCompose from "./UserCompose";
import UserFeed from "./UserFeed";
import UserSidebar from "./UserSidebar";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useState } from "react";
import DashboardRightSidebar from "./DashboardRightSidebar";

export default function DashboardPage() {
  const { profileData } = useOutletContext();

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [feedType, setFeedType] = useState("forYou");

  const navigate = useNavigate();

  const handlePostCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  return (
    <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_340px]">
      <UserSidebar
        feedType={feedType}
        setFeedType={setFeedType}
        onLogout={handleLogout}
      />

      <main className="min-w-0">
        <DashboardCompose
          profileData={profileData}
          onPostCreated={handlePostCreated}
        />

        <div className="mt-6">
          <UserFeed
            profileData={profileData}
            refreshTrigger={refreshTrigger}
            feedType={feedType}
          />
        </div>
      </main>

      <DashboardRightSidebar profileData={profileData} />
    </div>
  );
}
