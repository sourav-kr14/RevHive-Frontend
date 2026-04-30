import { motion } from "framer-motion";
import { Image, Link2, Hash } from "lucide-react";

export default function DashboardCompose({
  profileData,
  postText,
  setPostText,
}) {
  const initials = profileData.username
    ? profileData.username.slice(0, 2).toUpperCase()
    : "RH";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative group"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-cyan-500/30 blur-xl opacity-0 group-focus-within:opacity-100 transition-all duration-500" />

      {/* Card */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 transition-all duration-300 group-focus-within:border-blue-500/40 group-hover:border-white/20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold shadow-lg shadow-purple-500/20"
          >
            {initials}
          </motion.div>

          {/* Text */}
          <div>
            <p className="text-sm font-medium text-gray-300">
              What’s buzzing in the hive?
            </p>
            <p className="text-xs text-gray-500">
              Share updates, ideas or moments 🚀
            </p>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 resize-none outline-none text-sm leading-relaxed focus:border-blue-500/40 focus:bg-white/10 transition-all duration-300"
          placeholder="Share something with the hive…"
          rows="3"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        />

        {/* Bottom Section */}
        <div className="flex items-center justify-between mt-4">
          {/* Actions */}
          <div className="flex gap-2">
            {[
              { icon: <Image size={16} /> },
              { icon: <Link2 size={16} /> },
              { icon: <Hash size={16} /> },
            ].map((item, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 backdrop-blur-md transition-all flex items-center justify-center"
              >
                {item.icon}
              </motion.button>
            ))}
          </div>

          {/* Post Button */}
          <motion.button
            whileHover={postText.trim() ? { scale: 1.05, y: -1 } : {}}
            whileTap={postText.trim() ? { scale: 0.95 } : {}}
            disabled={!postText.trim()}
            className="relative px-6 py-2 rounded-xl text-sm font-semibold overflow-hidden"
          >
            {/* Gradient Background */}
            <span
              className={`absolute inset-0 transition-all duration-300 ${
                postText.trim()
                  ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-100"
                  : "bg-white/10 opacity-50"
              }`}
            />

            {/* Glow */}
            {postText.trim() && (
              <span className="absolute inset-0 blur-lg bg-gradient-to-r from-blue-500 to-purple-500 opacity-40" />
            )}

            {/* Text */}
            <span className="relative z-10">Post it ✨</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
