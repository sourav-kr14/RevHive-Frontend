import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";

import DashboardStats from "./UserStats";
import UserFeed from "@/components/userdashboard/UserFeed";
import FollowButton from "@/components/common/FollowButton";

export default function ProfileLayout() {
  const { profileData } = useOutletContext();

  const [currentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="
        bg-white border border-gray-200
        rounded-2xl p-6 shadow-sm
        "
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div
              className="
              w-20 h-20 rounded-full
              bg-gradient-to-br
              from-purple-500 to-blue-500
              flex items-center justify-center
              text-white text-3xl font-bold
              shrink-0
              "
            >
              {profileData?.username?.[0]?.toUpperCase() || "U"}
            </div>

            {/* User Info */}
            <div>
              <h2 className="text-3xl font-bold text-black">
                @{profileData?.username}
              </h2>

              <p className="text-gray-500 text-sm mt-2">
                {profileData?.bio || "No bio added yet"}
              </p>
            </div>
          </div>

          {/* Follow Button */}
          {currentUser &&
            Number(currentUser.id) !== Number(profileData?.id) && (
              <FollowButton
                userId={Number(profileData.id)}
                currentUserId={Number(currentUser.id)}
                size="md"
              />
            )}
        </div>
      </motion.div>

      {/* Stats */}
      <DashboardStats userId={profileData?.id} />

      {/* Posts */}
      <div
        className="
        bg-white border border-gray-200
        rounded-2xl p-5 shadow-sm
        "
      >
        <UserFeed profileData={profileData} onlyUserPosts={true} />
      </div>
    </div>
  );
}
