import DashboardCompose from "./UserCompose";
import UserFeed from "./UserFeed";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";

export default function DashboardPage() {
  const { profileData } = useOutletContext();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePostCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <DashboardCompose
        profileData={profileData}
        onPostCreated={handlePostCreated}
      />
      <UserFeed profileData={profileData} refreshTrigger={refreshTrigger} />
    </>
  );
}
