// UserSidebar.jsx

import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
import UserSearch from "./UserSearch";

export default function UserSidebar({ feedType, setFeedType, onLogout }) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72">
        <div className="sticky top-24 h-[calc(100vh-120px)]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="
            h-full
            flex flex-col
            bg-white/90 backdrop-blur-xl
            border border-sky-100
            rounded-[30px]
            p-4
            shadow-sm
            "
          >
            {/* Top */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Explore</h2>

              {/* Search */}
              <UserSearch />

              {/* Feed Buttons */}
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
            </div>

            {/* Bottom Logout */}
            <div className="mt-auto pt-5">
              <button
                onClick={onLogout}
                className="
                  w-full
                  flex items-center justify-center gap-2
                  py-3
                  rounded-2xl
                  bg-red-50
                  text-red-500
                  font-medium
                  hover:bg-red-100
                  transition-all duration-300
                "
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      </aside>
    </>
  );
}
