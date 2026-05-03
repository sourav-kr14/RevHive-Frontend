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
    followingCount: 0,
  });

  useEffect(() => {
    if (profileData?.id) fetchStats();
  }, [profileData]);

  const fetchStats = async () => {
    try {
      const [followersRes, followingRes] = await Promise.all([
        followAPI.getFollowersCount(profileData.id),
        followAPI.getFollowingCount(profileData.id),
      ]);

      setStats({
        postsCount: profileData.postsCount || 0,
        followersCount: followersRes.data.followersCount || 0,
        followingCount: followingRes.data.followingCount || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const statItems = [
    {
      label: "Posts",
      value: stats.postsCount,
      icon: BarChart3,
      clickable: false,
    },
    {
      label: "Followers",
      value: stats.followersCount,
      icon: Users,
      clickable: true,
      type: "followers",
    },
    {
      label: "Following",
      value: stats.followingCount,
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
      <div className="grid grid-cols-3 gap-4">
        {statItems.map((s, i) => {
          const Icon = s.icon;

          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -2 }}
              onClick={() => handleStatClick(s)}
              className={`bg-white border border-gray-200 rounded-xl p-4 shadow-sm transition ${
                s.clickable ? "cursor-pointer hover:bg-gray-50" : ""
              }`}
            >
              {/* Top */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  {s.label}
                </p>

                <div className="p-2 rounded-md bg-gray-100">
                  <Icon size={16} className="text-gray-700" />
                </div>
              </div>

              {/* Value */}
              <p className="text-2xl font-semibold text-gray-900">
                {s.value.toLocaleString()}
              </p>

              {/* Simple Progress Line */}
              <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(s.value, 100)}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gray-900"
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
