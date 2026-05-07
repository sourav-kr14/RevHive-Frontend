import { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardStats from "./UserStats";
import UserFeed from "@/components/userdashboard/UserFeed";
import FollowButton from "@/components/common/FollowButton";
import { authAPI } from "@/services/api";
import { Loader, AlertCircle } from "lucide-react";

export default function ProfileLayout() {
  const { userId } = useParams();
  const { profileData: contextProfileData } = useOutletContext() ?? {};

  const [currentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Viewing own profile via context (no userId param)
    if (!userId && contextProfileData?.id) {
      setProfileData(contextProfileData);
      setLoading(false);
      return;
    }

    if (!userId && !contextProfileData?.id) {
      setLoading(false);
      setError("No profile to display");
      return;
    }

    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Single call — backend returns id, username, bio, postsCount,
        // followersCount, followingCount all in one response
        const res = await authAPI.getProfile(Number(userId));
        setProfileData(res.data);
      } catch (err) {
        setError(
          `Failed to load profile: ${err.response?.data?.message || err.message}`,
        );
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, contextProfileData?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader
            size={48}
            className="animate-spin mx-auto mb-4 text-purple-500"
          />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <p className="text-red-700 font-semibold mb-2">Error</p>
          <p className="text-red-600">{error || "Profile not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-3xl font-bold shrink-0">
              {profileData?.username?.[0]?.toUpperCase() || "U"}
            </div>

            {/* Name + Bio */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-black mb-2">
                {profileData?.username || "User"}
              </h2>
              <p className="text-gray-500">
                {profileData?.bio || "No bio added yet"}
              </p>
            </div>
          </div>

          {/* Follow Button — only for other users */}
          {currentUser && (
            <FollowButton
              userId={Number(profileData?.id)}
              currentUserId={Number(currentUser?.id)}
              size="md"
            />
          )}
        </div>
      </motion.div>

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
