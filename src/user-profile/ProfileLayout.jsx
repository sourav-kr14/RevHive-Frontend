import { useOutletContext } from "react-router-dom";
import DashboardStats from "./UserStats";
import UserFeed from "@/components/userdashboard/UserFeed";
import FollowButton from "@/components/common/FollowButton";
import { authAPI } from "@/services/api";
import { Loader, AlertCircle } from "lucide-react";

export default function ProfileLayout() {
  const { profileData } = useOutletContext();

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      {/* 
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full 
            bg-gradient-to-br from-purple-500 to-blue-500 
            flex items-center justify-center 
            text-white text-2xl font-semibold"
          >
            {profileData?.username?.[0]?.toUpperCase()}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              @{profileData?.username}
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              {profileData?.bio || "No bio added yet"}
            </p>
          </div>
        </div>
      </div> 
      */}

      {/* Stats Cards — Posts / Followers / Following */}
      <DashboardStats
        userId={profileData?.id}
        postsCount={profileData?.postsCount ?? 0}
        followersCount={profileData?.followersCount ?? 0}
        followingCount={profileData?.followingCount ?? 0}
      />

      {/* User Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
      >
        <UserFeed
          profileData={{
            id: profileData?.id,
            username: profileData?.username,
          }}
          onlyUserPosts={true}
        />
      </motion.div>
    </div>
  );
}
