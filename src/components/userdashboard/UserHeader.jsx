// src/components/userdashboard/UserHeader.jsx
import { motion } from "framer-motion";
import { Bell, Mail, Sparkles } from "lucide-react";
import NotificationBell from "../common/NotificationBell";

export default function DashboardHeader({ profileData }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-start justify-between relative"
    >
      {/* LEFT */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={14} className="text-purple-400" />
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            {getGreeting()}
          </p>
        </div>

        <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-2">
          {profileData?.username || 'User'}
          <motion.span
            animate={{ rotate: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            👋
          </motion.span>
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Here's what's happening in your hive today
        </p>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex gap-3">
        {/* Notification Bell Component */}
        <NotificationBell userId={profileData?.id} />
        
        {/* Messages Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-11 h-11 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-gray-400 hover:text-purple-400 hover:border-purple-500/30 transition-all flex items-center justify-center"
        >
          {/* Glow */}
          <span className="absolute inset-0 rounded-xl bg-purple-500/10 opacity-0 hover:opacity-100 blur-md transition-all" />
          
          {/* Icon */}
          <Mail size={18} className="relative z-10" />
          
          {/* Message Dot */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full shadow-md shadow-purple-500/50" />
        </motion.button>
      </div>
    </motion.div>
  );
}