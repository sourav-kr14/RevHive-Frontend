import { motion } from "framer-motion";

export default function Card({ title, value = 0 }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative p-5 rounded-2xl 
      bg-white/5 backdrop-blur-xl border border-white/10 
      shadow-[0_0_20px_rgba(139,92,246,0.08)] transition"
    >
      {/* Glow overlay */}
      <div
        className="absolute inset-0 rounded-2xl 
      bg-gradient-to-r from-purple-500/10 to-blue-500/10 
      opacity-0 hover:opacity-100 transition"
      />

      {/* Title */}
      <p className="text-sm text-gray-400 mb-2 relative z-10">{title}</p>

      {/* Value */}
      <h2 className="text-2xl font-semibold text-white relative z-10">
        {Number(value).toLocaleString()}
      </h2>
    </motion.div>
  );
}
