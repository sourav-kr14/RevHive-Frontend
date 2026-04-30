import { motion } from "framer-motion";
import { BarChart3, Users, UserPlus } from "lucide-react";

export default function DashboardStats({ profileData }) {
  const stats = [
    {
      label: "Posts",
      value: profileData.postsCount || 0,
      gradient: "from-blue-500 to-cyan-500",
      icon: BarChart3,
    },
    {
      label: "Followers",
      value: profileData.followersCount || 0,
      gradient: "from-purple-500 to-pink-500",
      icon: Users,
    },
    {
      label: "Following",
      value: profileData.followingCount || 0,
      gradient: "from-emerald-400 to-teal-500",
      icon: UserPlus,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-5">
      {stats.map((s, i) => {
        const Icon = s.icon;

        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="relative group"
          >
            {/* Glow layer */}
            <div
              className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r ${s.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500`}
            />

            {/* Card */}
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300 group-hover:border-white/20">
              {/* Header */}
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

              {/* Value */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-4xl font-bold mb-4 tabular-nums leading-none text-white"
              >
                {s.value.toLocaleString()}
              </motion.p>

              {/* Progress */}
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
  );
}
