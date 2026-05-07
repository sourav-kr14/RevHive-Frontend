// components/common/SocialModal.jsx
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, UserCheck, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { followAPI } from "../../services/api";

export default function SocialModal({ userId, type, onClose, currentUserId }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingStatus, setFollowingStatus] = useState({});
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [userId, type]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let response;
      if (type === "followers") {
        response = await followAPI.getFollowers(userId, 0, 50);
      } else {
        response = await followAPI.getFollowing(userId, 0, 50);
      }

      const usersList = response.data.data || [];
      setUsers(usersList);

      // Check following status for each user (if not viewing own list)
      if (currentUserId !== userId) {
        const status = {};
        for (const user of usersList) {
          try {
            const followCheck = await followAPI.isFollowing(
              currentUserId,
              user.id,
            );
            status[user.id] = followCheck.data.isFollowing;
          } catch (error) {
            status[user.id] = false;
          }
        }
        setFollowingStatus(status);
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (targetUserId) => {
    setProcessingId(targetUserId);
    try {
      if (followingStatus[targetUserId]) {
        await followAPI.unfollowUser(currentUserId, targetUserId);
        setFollowingStatus({ ...followingStatus, [targetUserId]: false });
      } else {
        await followAPI.followUser(currentUserId, targetUserId);
        setFollowingStatus({ ...followingStatus, [targetUserId]: true });
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white border border-gray-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-black">
              {type === "followers" ? "Followers" : "Following"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>
          </div>

          {/* Users List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="animate-spin text-purple-500" size={32} />
              </div>
            ) : users.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                        {user.username?.slice(0, 2).toUpperCase() || "US"}
                      </div>

                      {/* User Info */}
                      <div>
                        <p className="font-medium text-gray-900">
                          @{user.username}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user.bio || "No bio yet"}
                        </p>
                      </div>
                    </div>

                    {/* Follow Button (if not current user) */}
                    {user.id !== currentUserId && (
                      <button
                        onClick={() => handleFollowToggle(user.id)}
                        disabled={processingId === user.id}
                        className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1 transition-all ${
                          followingStatus[user.id]
                            ? "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-500 hover:text-red-400"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                        } ${processingId === user.id ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {processingId === user.id ? (
                          <Loader size={12} className="animate-spin" />
                        ) : followingStatus[user.id] ? (
                          <>
                            <UserCheck size={12} />
                            Following
                          </>
                        ) : (
                          <>
                            <UserPlus size={12} />
                            Follow
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">👥</div>
                <p className="text-gray-400">No {type} yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
