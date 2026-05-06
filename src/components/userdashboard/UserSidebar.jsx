import { Flame, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function UserSidebar({ feedType, setFeedType }) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72">
        <div className="sticky top-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-3xl p-4 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Explore
            </h2>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => setFeedType("forYou")}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                  feedType === "forYou"
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Sparkles size={18} />
                <span className="font-medium">For You</span>
              </button>

              <button
                onClick={() => setFeedType("trending")}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                  feedType === "trending"
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Flame size={18} />
                <span className="font-medium">Trending</span>
              </button>
            </div>
          </motion.div>
        </div>
      </aside>

      {/* Mobile Feed Tabs */}
      <div className="lg:hidden flex gap-3 overflow-x-auto mb-5">
        <button
          onClick={() => setFeedType("forYou")}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
            feedType === "forYou"
              ? "bg-black text-white"
              : "bg-white border border-gray-200 text-gray-700"
          }`}
        >
          For You
        </button>

        <button
          onClick={() => setFeedType("trending")}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
            feedType === "trending"
              ? "bg-black text-white"
              : "bg-white border border-gray-200 text-gray-700"
          }`}
        >
          Trending
        </button>
      </div>
    </>
  );
}
