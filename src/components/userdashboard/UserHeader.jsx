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
      className="flex items-start justify-between"
    >
      {/* LEFT */}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {getGreeting()}
        </p>

        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          {profileData.username}
          <motion.span
            animate={{ rotate: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            👋
          </motion.span>
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Here's what's happening in your hive today
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex gap-2">
        {/* Notification */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-10 h-10 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 flex items-center justify-center"
        >
          <Bell size={16} />

          <span className="absolute top-2 right-2 w-2 h-2 bg-gray-900 rounded-full" />
        </motion.button>

        {/* Messages */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-10 h-10 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 flex items-center justify-center"
        >
          <Mail size={16} />

          <span className="absolute top-2 right-2 w-2 h-2 bg-gray-900 rounded-full" />
        </motion.button>
      </div>
    </motion.div>
  );
}
