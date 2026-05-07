import { motion } from "framer-motion";
import { BarChart3, Users, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";

import SocialModal from "../components/common/SocialModal";
import { followAPI, postAPI } from "../services/api";

export default function DashboardStats({ userId }) {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);

  const [stats, setStats] = useState({
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
  });

  const currentUserId = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"))?.id;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!userId) return;

    fetchStats();
  }, [userId]);

  const fetchStats = async () => {
    try {
      const postsRes = await postAPI.getPostsCount(userId);

      const followersRes = await followAPI.getFollowersCount(userId);

      const followingRes = await followAPI.getFollowingCount(userId);

      setStats({
        postsCount: Number(postsRes.data?.postsCount) || 0,

        followersCount: Number(followersRes.data?.followersCount) || 0,

        followingCount: Number(followingRes.data?.followingCount) || 0,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const statItems = [
    {
      label: "Posts",
      value: stats.postsCount,
      icon: BarChart3,
    },
    {
      label: "Followers",
      value: stats.followersCount,
      icon: Users,
      type: "followers",
    },
    {
      label: "Following",
      value: stats.followingCount,
      icon: UserPlus,
      type: "following",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statItems.map((s, i) => {
          const Icon = s.icon;

          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -3, scale: 1.02 }}
              onClick={() => s.type && openModal(s.type)}
              className={`
                relative p-5 rounded-2xl
                bg-white border border-gray-200
                shadow-sm transition-all
                ${
                  s.type
                    ? "cursor-pointer hover:shadow-md hover:border-gray-300"
                    : ""
                }
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                  {s.label}
                </p>

                <div
                  className="
                  p-2 rounded-lg
                  bg-gradient-to-br
                  from-purple-500 to-blue-500
                  "
                >
                  <Icon size={16} className="text-white" />
                </div>
              </div>

              <p className="text-2xl font-bold text-black">
                {Number(s.value).toLocaleString()}
              </p>

              <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(Number(s.value), 100)}%`,
                  }}
                  transition={{ duration: 0.8 }}
                  className="
                  h-full
                  bg-gradient-to-r
                  from-purple-500 to-blue-500
                  "
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {showModal && userId && (
        <SocialModal
          userId={userId}
          type={modalType}
          currentUserId={currentUserId}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
