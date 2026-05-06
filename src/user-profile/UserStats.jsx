import { motion } from "framer-motion";
import { BarChart3, Users, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import SocialModal from "../components/common/SocialModal";
import { followAPI, postAPI } from "../services/api";

export default function DashboardStats({ profileData }) {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);

  const [stats, setStats] = useState({
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
  });

  const fetchStats = async () => {
    if (!profileData?.id) return;

    try {
      console.log("PROFILE:", profileData);

      // POSTS COUNT
      const postsRes = await postAPI.getPostsCount(profileData.id);
      console.log("POSTS RESPONSE:", postsRes.data);

      // FOLLOWERS
      const followersRes = await followAPI.getFollowersCount(profileData.id);

      // FOLLOWING
      const followingRes = await followAPI.getFollowingCount(profileData.id);

      setStats({
        postsCount: Number(postsRes.data?.postsCount) || 0,
        followersCount: Number(followersRes.data?.followersCount) || 0,
        followingCount: Number(followingRes.data?.followingCount) || 0,
      });
    } catch (err) {
      console.log("STATS ERROR:", err);
    }
  };

  useEffect(() => {
    console.log("PROFILE DATA CHANGED:", profileData);

    fetchStats();
  }, [profileData]);

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
              className={`relative p-5 rounded-2xl
              bg-white/5 backdrop-blur-xl border border-white/10
              shadow-[0_0_20px_rgba(139,92,246,0.08)]
              transition-all
              ${s.type ? "cursor-pointer hover:bg-white/10" : ""}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-black uppercase tracking-wider">
                  {s.label}
                </p>

                <div
                  className="p-2 rounded-lg
                  bg-gradient-to-br from-purple-500 to-blue-500"
                >
                  <Icon size={16} className="text-white" />
                </div>
              </div>

              {/* Count */}
              <p className="text-2xl font-semibold text-black">
                {s.value.toLocaleString()}
              </p>

              {/* Progress */}
              <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(s.value, 100)}%`,
                  }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && profileData?.id && (
        <SocialModal
          userId={profileData.id}
          type={modalType}
          currentUserId={profileData.id}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
