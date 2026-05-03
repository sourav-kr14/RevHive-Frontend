import { motion } from "framer-motion";

export default function Card({ title, value }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
    >
      <p className="text-sm text-gray-500 mb-1">{title}</p>

      <h2 className="text-2xl font-semibold text-gray-900">{value ?? 0}</h2>
    </motion.div>
  );
}
