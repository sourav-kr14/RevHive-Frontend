import { motion } from "framer-motion";
import { Bell, Mail } from "lucide-react";

export default function DashboardHeader({ profileData }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
    >
      {/* LEFT */}
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
          {getGreeting()}
        </p>

        <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
          @{profileData?.username || "user"}
          <motion.span
            animate={{ rotate: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            👋
          </motion.span>
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Here’s what’s happening in your hive today
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex gap-3">
        {[Bell, Mail].map((Icon, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-11 h-11 flex items-center justify-center 
            rounded-xl bg-white/5 border border-white/10 
            text-gray-400 hover:text-white hover:bg-white/10 
            backdrop-blur-md transition"
          >
            <Icon size={17} />

            {/* Notification dot */}
            <span
              className="absolute top-2 right-2 w-2 h-2 
            bg-gradient-to-r from-purple-500 to-blue-500 
            rounded-full shadow-[0_0_6px_rgba(139,92,246,0.8)]"
            />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
