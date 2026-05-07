import { Search, UserRound, Check } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";

export default function UserSearch() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) {
        fetchUsers();
      } else {
        setUsers([]);
      }
    }, 350);

    return () => clearTimeout(delay);
  }, [query]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/users/search?query=${query}`);

      setUsers((res.data || []).filter((user) => !user.isFollowing));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (userId, isFollowing) => {
    try {
      const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;

      if (!currentUserId) return;

      if (isFollowing) {
        await api.delete("/v1/follows/unfollow", {
          params: {
            followerId: currentUserId,
            followingId: userId,
          },
        });
      } else {
        await api.post("/v1/follows/follow", null, {
          params: {
            followerId: currentUserId,
            followingId: userId,
          },
        });
      }

      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mb-5 relative">
      {/* Search Input */}
      <motion.div
        whileTap={{ scale: 0.99 }}
        className="
        flex items-center gap-3
        px-4 py-3
        rounded-2xl
        bg-white/70
        backdrop-blur-xl
        border border-gray-100
        shadow-sm
        focus-within:border-sky-300
        focus-within:shadow-lg
        focus-within:shadow-sky-100
        transition-all duration-300
      "
      >
        <Search
          size={18}
          className="
            text-gray-400
            transition-all duration-300
          "
        />

        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="
            w-full bg-transparent outline-none
            text-sm font-medium text-gray-800
            placeholder:text-gray-400
          "
        />
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {query && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="
              absolute z-50
              w-full
              mt-3
              bg-white/95
              backdrop-blur-2xl
              border border-white/40
              rounded-3xl
              overflow-hidden
              shadow-[0_20px_60px_rgba(0,0,0,0.10)]
            "
          >
            {loading ? (
              <div className="p-5 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 animate-pulse"
                  >
                    <div className="w-11 h-11 rounded-full bg-gray-200" />

                    <div className="flex-1">
                      <div className="h-3 w-28 rounded bg-gray-200 mb-2" />
                      <div className="h-2 w-20 rounded bg-gray-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : users.length > 0 ? (
              users.map((user) => (
                <motion.div
                  key={user.id}
                  whileHover={{ scale: 1.01 }}
                  className="
                    group
                    flex items-center justify-between
                    gap-3
                    px-4 py-4
                    hover:bg-gradient-to-r
                    hover:from-sky-50
                    hover:to-cyan-50
                    transition-all duration-300
                    border-b border-gray-50
                    last:border-none
                  "
                >
                  {/* Left */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar */}
                    <div className="relative">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.username}
                          className="
                            w-12 h-12 rounded-full
                            object-cover
                            ring-2 ring-white
                            shadow-sm
                            group-hover:scale-105
                            transition-all duration-300
                          "
                        />
                      ) : (
                        <div
                          className="
                            w-12 h-12
                            rounded-full
                            bg-gradient-to-br
                            from-sky-500
                            to-cyan-500
                            flex items-center justify-center
                            text-white
                            shadow-md
                            group-hover:scale-105
                            transition-all duration-300
                          "
                        >
                          <UserRound size={18} />
                        </div>
                      )}

                      {/* Online Dot */}
                      <div
                        className="
                          absolute bottom-0 right-0
                          w-3.5 h-3.5
                          rounded-full
                          bg-green-500
                          border-2 border-white
                        "
                      />
                    </div>

                    {/* User Info */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <h3
                          className="
                            font-semibold
                            text-gray-900
                            truncate
                          "
                        >
                          {user.username}
                        </h3>

                        <div
                          className="
                            w-4 h-4
                            rounded-full
                            bg-sky-500
                            flex items-center justify-center
                          "
                        >
                          <Check size={10} className="text-white" />
                        </div>
                      </div>

                      <p
                        className="
                          text-xs text-gray-500
                          truncate
                        "
                      >
                        @{user.email?.split("@")[0]}
                      </p>

                      <p className="text-[11px] text-gray-400 mt-1">
                        Suggested for you
                      </p>
                    </div>
                  </div>

                  {/* Follow Button */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      handleFollowToggle(user.id, user.isFollowing)
                    }
                    className={`
    px-4 py-2
    rounded-full
    text-sm font-semibold
    transition-all duration-300
    ${
      user.isFollowing
        ? `
          bg-gray-100
          text-gray-700
          hover:bg-red-50
          hover:text-red-500
        `
        : `
          bg-gradient-to-r
          from-sky-500
          to-cyan-500
          text-white
          shadow-lg
          shadow-sky-100
          hover:shadow-sky-200
        `
    }
  `}
                  >
                    {user.isFollowing ? "Following" : "Follow"}
                  </motion.button>
                </motion.div>
              ))
            ) : (
              <div
                className="
                  py-10 px-4
                  text-center
                "
              >
                <div
                  className="
                    w-14 h-14
                    rounded-2xl
                    bg-gray-100
                    flex items-center justify-center
                    mx-auto mb-3
                  "
                >
                  <Search size={22} className="text-gray-400" />
                </div>

                <h3 className="font-semibold text-gray-700 mb-1">
                  No users found
                </h3>

                <p className="text-sm text-gray-400">Try another username</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
