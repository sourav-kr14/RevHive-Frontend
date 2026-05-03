// components/userdashboard/SocialModal.jsx
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { X, UserPlus, UserCheck } from "lucide-react";
import { followAPI } from "../../services/api";

export default function SocialModal({ userId, type, onClose, currentUserId }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingStatus, setFollowingStatus] = useState({});

  useEffect(() => {
    fetchUsers();
  }, [userId, type]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let response;
      if (type === "followers") {
        response = await followAPI.getFollowers(userId);
      } else {
        response = await followAPI.getFollowing(userId);
      }
      setUsers(response.data.data || []);
      
      // Check following status for each user
      const status = {};
      for (const user of (response.data.data || [])) {
        try {
          const followCheck = await followAPI.isFollowing(currentUserId, user.id);
          status[user.id] = followCheck.data.isFollowing;
        } catch (error) {
          status[user.id] = false;
        }
      }
      setFollowingStatus(status);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (targetUserId) => {
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
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-lg font-semibold">
            {type === "followers" ? "Followers" : "Following"}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : users.length > 0 ? (
            <div className="divide-y divide-white/10">
              {users.map((user) => (
                <div key={user.id} className="p-4 flex items-center justify-between hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                      {user.username?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-white">@{user.username}</p>
                      <p className="text-xs text-gray-500">
                        {user.bio || "No bio yet"}
                      </p>
                    </div>
                  </div>
                  
                  {user.id !== currentUserId && (
                    <button
                      onClick={() => handleFollowToggle(user.id)}
                      className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
                        followingStatus[user.id]
                          ? "bg-white/10 text-gray-300 hover:bg-white/20"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                      }`}
                    >
                      {followingStatus[user.id] ? (
                        <>
                          <UserCheck size={14} />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus size={14} />
                          Follow
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No {type} found
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}