import { useState, useEffect } from "react";
import { followUser, unfollowUser, isFollowing } from "../services/followService";

export default function UserCard({ userId, username, bio, avatarUrl, onFollowChange }) {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;

  // Check if current user is already following this user
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (currentUserId && userId !== currentUserId) {
        try {
          const result = await isFollowing(currentUserId, userId);
          setFollowing(result);
        } catch (error) {
          console.error("Error checking follow status:", error);
        }
      }
    };

    checkFollowStatus();
  }, [userId, currentUserId]);

  const handleFollowClick = async () => {
    if (!currentUserId) return;
    if (userId === currentUserId) return; // Can't follow yourself

    setLoading(true);
    try {
      if (following) {
        // Unfollow
        await unfollowUser(currentUserId, userId);
        setFollowing(false);
      } else {
        // Follow
        await followUser(currentUserId, userId);
        setFollowing(true);
      }

      // Notify parent to refresh data
      if (onFollowChange) {
        onFollowChange();
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      alert("Failed to update follow status");
    } finally {
      setLoading(false);
    }
  };

  // Don't show follow button for own profile
  if (userId === currentUserId) {
    return null;
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-center gap-3">
        <img
          src={avatarUrl || `https://i.pravatar.cc/40?u=${userId}`}
          alt={username}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <div className="font-semibold">{username}</div>
          <div className="text-xs text-gray-400">{bio || "No bio"}</div>
        </div>
      </div>

      <button
        onClick={handleFollowClick}
        disabled={loading}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
          following
            ? "bg-white/10 border border-white/20 hover:bg-white/20 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading ? "Loading..." : following ? "Following" : "Follow"}
      </button>
    </div>
  );
}

