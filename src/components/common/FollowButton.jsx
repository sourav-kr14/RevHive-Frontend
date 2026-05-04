// components/common/FollowButton.jsx
import { motion } from "framer-motion";
import { UserPlus, UserCheck, Loader, UserMinus } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../services/api";

export default function FollowButton({ userId, currentUserId, onFollowChange }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);

  // Debug logging
  console.log("FollowButton received props:", { 
    userId, 
    currentUserId, 
    userIdType: typeof userId,
    currentUserIdType: typeof currentUserId,
    areEqual: Number(userId) === Number(currentUserId)
  });

  useEffect(() => {
    console.log("FollowButton useEffect triggered with:", { userId, currentUserId });
    if (userId && currentUserId && Number(userId) !== Number(currentUserId)) {
      checkFollowStatus();
    } else {
      console.log("FollowButton conditions not met:", {
        hasUserId: !!userId,
        hasCurrentUserId: !!currentUserId,
        isDifferent: Number(userId) !== Number(currentUserId)
      });
    }
  }, [userId, currentUserId]);

  const checkFollowStatus = async () => {
    const followerId = Number(currentUserId);
    const followingId = Number(userId);
    
    console.log("Checking follow status with:", { followerId, followingId });
    
    if (isNaN(followerId) || isNaN(followingId)) {
      console.error("Invalid IDs for status check");
      return;
    }
    
    try {
      const response = await api.get('/v1/follows/check', {
        params: { 
          followerId: followerId, 
          followingId: followingId 
        }
      });
      console.log("Follow status response:", response.data);
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const handleFollowToggle = async () => {
    const followerId = Number(currentUserId);
    const followingId = Number(userId);
    
    console.log("Follow button clicked:", { followerId, followingId, isFollowing });
    
    if (isNaN(followerId) || isNaN(followingId)) {
      console.error("Invalid IDs:", { followerId, followingId });
      alert("Invalid user IDs. Please refresh the page.");
      return;
    }
    
    if (followerId === followingId) {
      console.warn("Cannot follow yourself");
      alert("You cannot follow yourself");
      return;
    }
    
    setLoading(true);
    
    try {
      if (isFollowing) {
        const response = await api.delete('/v1/follows/unfollow', {
          params: { 
            followerId: followerId, 
            followingId: followingId 
          }
        });
        
        if (response.data.success) {
          setIsFollowing(false);
          if (onFollowChange) onFollowChange(false);
          console.log("✅ Unfollowed successfully");
        }
      } else {
        const response = await api.post('/v1/follows/follow', null, {
          params: { 
            followerId: followerId, 
            followingId: followingId 
          }
        });
        
        if (response.data.success) {
          setIsFollowing(true);
          if (onFollowChange) onFollowChange(true);
          console.log("✅ Followed successfully");
        }
      }
    } catch (error) {
      console.error("❌ Follow/Unfollow error:", error.response?.data);
      const errorMessage = error.response?.data?.message || "Operation failed. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Don't render button for self or if no user ID
  // FORCE RENDER BUTTON FOR TESTING - REMOVE THIS LINE AFTER DEBUGGING
  // if (!currentUserId || !userId || Number(userId) === Number(currentUserId)) {
  //   console.log("Hiding FollowButton - conditions not met");
  //   return null;
  // }

  // TEMPORARY: Always show button for testing
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleFollowToggle}
      disabled={loading}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
        isFollowing
          ? "bg-white/10 text-gray-300 hover:bg-red-500/20 hover:text-red-400"
          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {loading ? (
        <Loader size={12} className="animate-spin" />
      ) : isFollowing ? (
        hover ? (
          <>
            <UserMinus size={12} />
            Unfollow
          </>
        ) : (
          <>
            <UserCheck size={12} />
            Following
          </>
        )
      ) : (
        <>
          <UserPlus size={12} />
          Follow
        </>
      )}
    </motion.button>
  );
}