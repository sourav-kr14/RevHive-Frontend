import { useEffect, useState } from "react";
import { followAPI, authAPI } from "../../services/api";
import { Search, Loader2 } from "lucide-react";

export default function ChatList({ setSelectedUser, activeUserId }) {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      if (!currentUser?.id) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // 1. Fetch the IDs of users followed by current user
        const followRes = await followAPI.getFollowing(currentUser.id, 0, 100);
        const followedIds = followRes.data?.data || [];

        if (followedIds.length === 0) {
          setUsers([]);
          setLoading(false);
          return;
        }
        console.log("followedIds:", followedIds);

        // 2. Fetch profile details for each followed user ID in parallel
        const profilePromises = followedIds.map(async (user) => {
          try {
            const profileRes = await authAPI.getProfile(user.id);

            return profileRes.data; // profile response fields: id, username, bio, avatarUrl
          } catch (err) {
            console.error(`Failed to fetch profile for user ${user.id}:`, err);
            return null;
          }
        });

        const profiles = (await Promise.all(profilePromises)).filter(Boolean);
        setUsers(profiles);
      } catch (err) {
        console.error("Error fetching chat list users:", err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowedUsers();
  }, [currentUser?.id]);

  const filteredUsers = users.filter((u) =>
    u.username?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full bg-white/40 text-slate-800 p-4">
      <h2 className="text-xl font-bold tracking-tight mb-4 bg-gradient-to-r from-orange-500 via-rose-500 to-indigo-600 bg-clip-text text-transparent">
        Conversations
      </h2>

      {/* SEARCH INPUT */}
      <div className="relative mb-6">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
          <Search size={17} />
        </span>
        <input
          type="text"
          placeholder="Search followed users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition duration-300"
        />
      </div>

      {/* LIST OF USERS */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-32 text-slate-400">
            <Loader2 className="animate-spin mb-2 text-rose-500" size={24} />
            <p className="text-sm">Loading users...</p>
          </div>
        ) : error ? (
          <div className="text-center text-rose-500 text-sm p-4">{error}</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center text-slate-500 text-sm p-4 leading-relaxed">
            {searchQuery
              ? "No matches found"
              : "Follow users to start messaging them!"}
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isActive = activeUserId === user.id;
            return (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 border ${
                  isActive
                    ? "bg-rose-50/70 border-rose-200/60 shadow-sm"
                    : "bg-transparent border-transparent hover:bg-slate-100/70"
                }`}
              >
                {/* AVATAR */}
                <div className="relative flex-shrink-0">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-100"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {/* Follow indicator dot */}
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>

                {/* USER INFO */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">
                    {user.username}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user.bio || "Click to message"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
}
