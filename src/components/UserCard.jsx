import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";

import {
  followUser,
  unfollowUser,
  isFollowing,
} from "../services/followService";

export default function UserCard({
  userId,
  username,
  bio,
  avatarUrl,
  onFollowChange,
}) {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);

  const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (currentUserId && Number(userId) !== Number(currentUserId)) {
        try {
          const result = await isFollowing(
            Number(currentUserId),
            Number(userId),
          );

          setFollowing(result);
        } catch (error) {
          console.error("Error checking follow status:", error);
        }
      }
    };

    checkFollowStatus();
  }, [userId, currentUserId]);

  const handleFollowClick = async () => {
    if (!currentUserId || loading) return;

    if (Number(userId) === Number(currentUserId)) return;

    setLoading(true);

    try {
      if (following) {
        await unfollowUser(Number(currentUserId), Number(userId));

        setFollowing(false);
      } else {
        await followUser(Number(currentUserId), Number(userId));

        setFollowing(true);
      }

      if (onFollowChange) {
        onFollowChange();
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setLoading(false);
    }
  };

  // Don't render own card
  if (Number(userId) === Number(currentUserId)) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05]"
    >
      {/* Left */}
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="relative">
          <img
            src={avatarUrl || `https://i.pravatar.cc/100?u=${userId}`}
            alt={username}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10"
          />

          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/10 to-purple-500/10" />
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-semibold text-white">@{username}</h3>

          <p className="truncate text-xs text-gray-400">
            {bio || "No bio available"}
          </p>
        </div>
      </div>

      {/* Follow Button */}
      <motion.button
        whileHover={{ scale: loading ? 1 : 1.04 }}
        whileTap={{ scale: loading ? 1 : 0.96 }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={handleFollowClick}
        disabled={loading}
        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
          following
            ? "border border-white/10 bg-white/10 text-gray-300 hover:bg-red-500/15 hover:text-red-400"
            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/20"
        } ${loading ? "cursor-not-allowed opacity-70" : ""}`}
      >
        {loading ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Loading
          </>
        ) : following ? (
          hover ? (
            <>
              <UserPlus size={15} />
              Unfollow
            </>
          ) : (
            <>
              <UserCheck size={15} />
              Following
            </>
          )
        ) : (
          <>
            <UserPlus size={15} />
            Follow
          </>
        )}
      </motion.button>
    </motion.div>
  );
}
