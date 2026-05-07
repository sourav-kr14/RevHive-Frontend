import { motion } from "framer-motion";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../services/api";

export default function FollowButton({
  userId,
  currentUserId,
  onFollowChange,
}) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (userId && currentUserId && Number(userId) !== Number(currentUserId)) {
      checkFollowStatus();
    }
  }, [userId, currentUserId]);

  const checkFollowStatus = async () => {
    try {
      const response = await api.get("/v1/follows/check", {
        params: {
          followerId: Number(currentUserId),
          followingId: Number(userId),
        },
      });

      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const handleFollowToggle = async () => {
    if (loading) return;

    setLoading(true);

    const followerId = Number(currentUserId);
    const followingId = Number(userId);

    try {
      if (isFollowing) {
        await api.delete("/v1/follows/unfollow", {
          params: {
            followerId,
            followingId,
          },
        });

        setIsFollowing(false);

        if (onFollowChange) {
          onFollowChange(false);
        }
      } else {
        await api.post("/v1/follows/follow", null, {
          params: {
            followerId,
            followingId,
          },
        });

        setIsFollowing(true);

        if (onFollowChange) {
          onFollowChange(true);
        }
      }
    } catch (error) {
      console.error(
        "Follow toggle error:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  if (!currentUserId || Number(userId) === Number(currentUserId)) {
    return null;
  }

  return (
    <motion.button
      whileHover={{ scale: loading ? 1 : 1.04 }}
      whileTap={{ scale: loading ? 1 : 0.96 }}
      onClick={handleFollowToggle}
      disabled={loading}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`group relative overflow-hidden rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
        isFollowing
          ? "bg-white/10 text-gray-300 hover:bg-red-500/15 hover:text-red-400 border border-white/10"
          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/20"
      } ${loading ? "cursor-not-allowed opacity-70" : ""}`}
    >
      {/* Glow */}
      {!isFollowing && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10" />
      )}

      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Processing
          </>
        ) : isFollowing ? (
          hover ? (
            <>
              <UserPlus size={16} />
              Unfollow
            </>
          ) : (
            <>
              <UserCheck size={16} />
              Following
            </>
          )
        ) : (
          <>
            <UserPlus size={16} />
            Follow
          </>
        )}
      </span>
    </motion.button>
  );
}
