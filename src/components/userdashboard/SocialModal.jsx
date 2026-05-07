// components/userdashboard/SocialModal.jsx

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, UserPlus, UserCheck, Users } from "lucide-react";

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

      const usersData = response.data.data || [];

      setUsers(usersData);

      const statusEntries = await Promise.all(
        usersData.map(async (user) => {
          try {
            const followCheck = await followAPI.isFollowing(
              currentUserId,
              user.id,
            );

            return [user.id, followCheck.data.isFollowing];
          } catch {
            return [user.id, false];
          }
        }),
      );

      setFollowingStatus(Object.fromEntries(statusEntries));
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

        setFollowingStatus((prev) => ({
          ...prev,
          [targetUserId]: false,
        }));
      } else {
        await followAPI.followUser(currentUserId, targetUserId);

        setFollowingStatus((prev) => ({
          ...prev,
          [targetUserId]: true,
        }));
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.92,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
          }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-md overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_20px_80px_rgba(0,0,0,0.12)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-lg">
                <Users size={18} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  {type === "followers" ? "Followers" : "Following"}
                </h2>

                <p className="text-xs text-gray-500">{users.length} people</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-black"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[420px] overflow-y-auto p-3">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex animate-pulse items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-2xl bg-gray-200" />

                      <div className="space-y-2">
                        <div className="h-3 w-24 rounded bg-gray-200" />
                        <div className="h-2 w-32 rounded bg-gray-100" />
                      </div>
                    </div>

                    <div className="h-9 w-24 rounded-xl bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : users.length > 0 ? (
              <div className="space-y-3">
                {users.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.04,
                    }}
                    className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all duration-300 hover:border-gray-200 hover:bg-gray-100"
                  >
                    {/* Left */}
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 text-sm font-bold text-white shadow-lg">
                        {user.username?.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-gray-900">
                          @{user.username}
                        </h3>

                        <p className="truncate text-xs text-gray-500">
                          {user.bio || "No bio available"}
                        </p>
                      </div>
                    </div>

                    {/* Follow Button */}
                    {user.id !== currentUserId && (
                      <button
                        onClick={() => handleFollowToggle(user.id)}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                          followingStatus[user.id]
                            ? "border border-gray-200 bg-white text-gray-700 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                            : "bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-md hover:scale-[1.03] hover:shadow-lg"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
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
                        </span>
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-100 to-blue-100">
                  <Users size={28} className="text-violet-500" />
                </div>

                <h3 className="text-lg font-semibold text-gray-800">
                  No {type} yet
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Users will appear here.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
