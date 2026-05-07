import { motion } from "framer-motion";
import { BarChart3, Users, UserPlus, ArrowUpRight } from "lucide-react";

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
      gradient: "from-orange-500 to-amber-500",
    },
    {
      label: "Followers",
      value: stats.followersCount,
      icon: Users,
      type: "followers",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      label: "Following",
      value: stats.followingCount,
      icon: UserPlus,
      type: "following",
      gradient: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {statItems.map((s, i) => {
          const Icon = s.icon;

          return (
            <motion.div
              key={s.label}
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: i * 0.08,
              }}
              whileHover={{
                y: -4,
                scale: 1.015,
              }}
              onClick={() => s.type && openModal(s.type)}
              className={`
                group relative overflow-hidden
                rounded-[28px]
                border border-gray-200
                bg-white
                p-5
                shadow-sm
                transition-all duration-300
                ${
                  s.type
                    ? "cursor-pointer hover:border-gray-300 hover:shadow-xl"
                    : "hover:shadow-lg"
                }
              `}
            >
              {/* Background Glow */}
              <div
                className={`
                  absolute inset-0 opacity-0 transition-opacity duration-500
                  group-hover:opacity-100
                  bg-gradient-to-br ${s.gradient}/[0.03]
                `}
              />

              {/* Top */}
              <div className="relative mb-5 flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                    {s.label}
                  </p>

                  <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                    {Number(s.value).toLocaleString()}
                  </h2>
                </div>

                <div
                  className={`
                    flex h-12 w-12 items-center justify-center
                    rounded-2xl
                    bg-gradient-to-br ${s.gradient}
                    text-white
                    shadow-lg
                    transition-transform duration-300
                    group-hover:scale-110
                  `}
                >
                  <Icon size={20} />
                </div>
              </div>

              {/* Bottom */}
              <div className="relative">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-400">
                    Community activity
                  </p>

                  {s.type && (
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-500 transition-all duration-200 group-hover:text-black">
                      View
                      <ArrowUpRight
                        size={13}
                        className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </div>
                  )}
                </div>

                {/* Progress */}
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${Math.min(Number(s.value), 100)}%`,
                    }}
                    transition={{
                      duration: 1,
                      ease: "easeOut",
                    }}
                    className={`
                      h-full rounded-full
                      bg-gradient-to-r ${s.gradient}
                    `}
                  />
                </div>
              </div>

              {/* Hover Border Glow */}
              <div
                className={`
                  pointer-events-none absolute inset-0 rounded-[28px]
                  ring-1 ring-transparent
                  transition-all duration-300
                  group-hover:ring-gray-200
                `}
              />
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
