import { motion } from "framer-motion";

export default function Card({ title, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.25 }}
      className="group relative bg-white/5 p-5 rounded-2xl backdrop-blur-xl text-center 
                 border border-white/10 shadow-md overflow-hidden"
    >
      {/* hover glow (fixed with group) */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 
                      bg-gradient-to-r from-blue-500/10 to-purple-500/10"
      />

      {/* content */}
      <div className="relative z-10">
        <p className="text-gray-400 text-sm tracking-wide mb-2">{title}</p>

        <h2 className="text-3xl font-bold tracking-tight">{value ?? 0}</h2>
      </div>
    </motion.div>
  );
}
