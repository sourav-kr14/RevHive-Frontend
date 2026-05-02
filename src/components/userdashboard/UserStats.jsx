// components/userdashboard/UserStats.jsx
import { motion } from "framer-motion";
import { BarChart3, Users, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { followAPI } from "../../services/api";
import SocialModal from "../common/SocialModal";

export default function DashboardStats({ profileData }) {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [stats, setStats] = useState({
    postsCount: 0,
    followersCount: 0,
    followingCount: 0
  });

  useEffect(() => {
    if (profileData?.id) {
      fetchStats();
    }
  }, [profileData]);

  const fetchStats = async () => {
    try {
      const [followersRes, followingRes] = await Promise.all([
        followAPI.getFollowersCount(profileData.id),
        followAPI.getFollowingCount(profileData.id)
      ]);
      
      setStats({
        postsCount: profileData.postsCount || 0,
        followersCount: followersRes.data.followersCount || 0,
        followingCount: followingRes.data.followingCount || 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const statItems = [
    {
      label: "Posts",
      value: stats.postsCount,
      gradient: "from-blue-500 to-cyan-500",
      icon: BarChart3,
      clickable: false,
    },
    {
      label: "Followers",
      value: stats.followersCount,
      gradient: "from-purple-500 to-pink-500",
      icon: Users,
      clickable: true,
      type: "followers",
    },
    {
      label: "Following",
      value: stats.followingCount,
      gradient: "from-emerald-400 to-teal-500",
      icon: UserPlus,
      clickable: true,
      type: "following",
    },
  ];

  const handleStatClick = (stat) => {
    if (stat.clickable && profileData?.id) {
      setModalType(stat.type);
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-5">
        {statItems.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => handleStatClick(s)}
              className={`relative group ${s.clickable ? 'cursor-pointer' : ''}`}
            >
              <div
                className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r ${s.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500`}
              />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300 group-hover:border-white/20">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">
                    {s.label}
                  </p>
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${s.gradient} shadow-lg`}
                  >
                    <Icon size={16} className="text-white" />
                  </div>
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-4xl font-bold mb-4 tabular-nums leading-none text-white"
                >
                  {s.value.toLocaleString()}
                </motion.p>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(s.value, 100)}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full rounded-full bg-gradient-to-r ${s.gradient}`}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Social Modal */}
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