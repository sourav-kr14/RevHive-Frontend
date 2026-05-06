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
            className="
            bg-white/90 backdrop-blur-xl
            border border-sky-100
            rounded-[30px]
            p-4
            shadow-sm
            "
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">Explore</h2>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setFeedType("forYou")}
                className={`
                  flex items-center gap-3
                  px-4 py-3
                  rounded-2xl
                  transition-all duration-300
                  ${
                    feedType === "forYou"
                      ? `
                        bg-gradient-to-r
                        from-sky-500
                        to-cyan-500
                        text-white
                        shadow-lg shadow-sky-200
                        `
                      : `
                        text-gray-600
                        hover:bg-sky-50
                        hover:text-sky-600
                        `
                  }
                `}
              >
                <span className="font-medium">For You</span>
              </button>

              <button
                onClick={() => setFeedType("trending")}
                className={`
                  flex items-center gap-3
                  px-4 py-3
                  rounded-2xl
                  transition-all duration-300
                  ${
                    feedType === "trending"
                      ? `
                        bg-gradient-to-r
                        from-orange-400
                        to-amber-500
                        text-white
                        shadow-lg shadow-orange-200
                        `
                      : `
                        text-gray-600
                        hover:bg-orange-50
                        hover:text-orange-500
                        `
                  }
                `}
              >
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
          className={`
            px-4 py-2
            rounded-xl
            text-sm font-medium
            whitespace-nowrap
            transition-all duration-300
            ${
              feedType === "forYou"
                ? `
                  bg-gradient-to-r
                  from-sky-500
                  to-cyan-500
                  text-white
                  `
                : `
                  bg-white
                  border border-sky-100
                  text-gray-700
                  hover:bg-sky-50
                  `
            }
          `}
        >
          For You
        </button>

        <button
          onClick={() => setFeedType("trending")}
          className={`
            px-4 py-2
            rounded-xl
            text-sm font-medium
            whitespace-nowrap
            transition-all duration-300
            ${
              feedType === "trending"
                ? `
                  bg-gradient-to-r
                  from-orange-400
                  to-amber-500
                  text-white
                  `
                : `
                  bg-white
                  border border-orange-100
                  text-gray-700
                  hover:bg-orange-50
                  `
            }
          `}
        >
          Trending
        </button>
      </div>
    </>
  );
}
