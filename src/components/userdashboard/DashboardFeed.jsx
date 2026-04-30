import { motion } from "framer-motion";
import { Sparkles, ChevronDown, Compass } from "lucide-react";

export default function DashboardFeed({ profileData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-purple-400" />
          <h2 className="text-base font-semibold text-gray-200">Your Feed</h2>
        </div>

        {/* Filter */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 text-xs text-gray-400 border border-white/10 bg-white/5 backdrop-blur-md rounded-lg px-3 py-1.5 hover:text-white hover:border-white/20 transition-all"
        >
          Latest
          <ChevronDown size={14} />
        </motion.button>
      </div>

      {/* Content */}
      {profileData.postsCount > 0 ? (
        <div className="flex flex-col gap-4">
          {/* Future: Premium Post Cards */}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative group flex flex-col items-center justify-center py-20 rounded-2xl text-center overflow-hidden"
        >
          {/* Glow Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

          {/* Glass Card */}
          <div className="relative w-full bg-white/5 backdrop-blur-xl border border-white/10 border-dashed rounded-2xl p-10">
            {/* Floating Icon */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-5xl mb-4"
            >
              🐝
            </motion.div>

            {/* Title */}
            <p className="text-lg font-semibold text-gray-200 mb-1">
              The hive is quiet
            </p>

            {/* Subtitle */}
            <p className="text-gray-500 text-sm mb-6">
              Follow creators or share your first post to bring it to life
            </p>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-6 py-2.5 rounded-xl text-sm font-semibold overflow-hidden"
            >
              {/* Gradient */}
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-100" />

              {/* Glow */}
              <span className="absolute inset-0 blur-lg bg-gradient-to-r from-blue-500 to-purple-500 opacity-40" />

              {/* Content */}
              <span className="relative z-10 flex items-center gap-2">
                <Compass size={16} />
                Explore Communities
              </span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
