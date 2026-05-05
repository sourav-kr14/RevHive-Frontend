import { useState } from "react";
import { motion } from "framer-motion";

export default function AdminHeader() {
  const filters = ["12 months", "30 days", "7 days", "24 hours"];
  const [active, setActive] = useState("12 months");

  return (
    <div className="flex justify-between items-center">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-white">Dashboard</h1>

      {/* Filters */}
      <div className="flex gap-2">
        {filters.map((t) => (
          <motion.button
            key={t}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActive(t)}
            className={`px-3 py-1.5 text-sm rounded-lg transition
            ${
              active === t
                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {t}
          </motion.button>
        ))}

        {/* Filter Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="px-3 py-1.5 text-sm rounded-lg 
          bg-white/5 border border-white/10 
          text-gray-400 hover:text-white hover:bg-white/10"
        >
          Filters
        </motion.button>
      </div>
    </div>
  );
}
