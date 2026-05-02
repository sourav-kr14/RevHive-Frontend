// components/common/FollowButton.jsx
import { motion } from "framer-motion";
import { UserPlus, UserCheck, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../services/api"; // Don't import followAPI, use api directly

export default function FollowButton({ userId, currentUserId, onFollowChange }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (userId && currentUserId && userId !== currentUserId) {
      checkFollowStatus();
    }
  }, [userId, currentUserId]);

  const checkFollowStatus = async () => {
    try {
      // Use api directly - NOT with extra /api
      const response = await api.get('/v1/follows/check', {
        params: { 
          followerId: currentUserId, 
          followingId: userId 
        }
      });
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

const handleFollowToggle = async () => {
    console.log("Current User ID:", currentUserId);
    console.log("Target User ID:", userId);
    
    // Make sure IDs are numbers
    const followerId = Number(currentUserId);
    const followingId = Number(userId);
    
    console.log("Sending params:", { followerId, followingId });
    
    try {
        const response = await api.post('/v1/follows/follow', null, {
            params: { 
                followerId: followerId, 
                followingId: followingId 
            }
        });
        console.log("Follow response:", response.data);
    } catch (error) {
        console.error("Follow error:", error.response?.data);
    }
};

  if (userId === currentUserId || !currentUserId) {
    return null;
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleFollowToggle}
      disabled={loading}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
        isFollowing
          ? "bg-white/10 text-gray-300 hover:bg-red-500/20 hover:text-red-400"
          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {loading ? (
        <Loader size={16} className="animate-spin" />
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
    </motion.button>
  );
}