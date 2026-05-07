import { motion } from "framer-motion";
import { BarChart3, Users, UserPlus } from "lucide-react";
import { useState } from "react";
import SocialModal from "../components/common/SocialModal";

export default function DashboardStats({
  userId,
  postsCount = 0,
  followersCount = 0,
  followingCount = 0,
}) {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);

  const currentUserId = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"))?.id;
    } catch {
      return null;
    }
  })();

  const statItems = [
    { label: "Posts", value: postsCount, icon: BarChart3 },
    { label: "Followers", value: followersCount, icon: Users, type: "followers" },
    { label: "Following", value: followingCount, icon: UserPlus, type: "following" },
  ];

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
              whileHover={{ y: -3, scale: 1.02 }}
              onClick={() => {
                if (s.type) {
                  setModalType(s.type);
                  setShowModal(true);
                }
              }}
              className={`relative p-5 rounded-2xl bg-white border border-gray-200 shadow-sm ${s.type ? "cursor-pointer hover:shadow-md hover:border-gray-300 transition-shadow" : ""}`}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                  {s.label}
                </p>
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
                  <Icon size={16} className="text-white" />
                </div>
              </div>

              <p className="text-2xl font-bold text-black">
                {Number(s.value).toLocaleString()}
              </p>

              <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(Number(s.value), 100)}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
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
