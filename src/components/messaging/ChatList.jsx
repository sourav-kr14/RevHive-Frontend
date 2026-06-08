import { useEffect, useState } from "react";
import { followAPI, authAPI, chatAPI } from "../../services/api";
import { Search, Loader2 } from "lucide-react";
import { connectWebSocket, disconnectWebSocket } from "../../services/webSocket";

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

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "";

    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      if (!currentUser?.id) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // 1. Fetch followed users
        const followRes = await followAPI.getFollowing(currentUser.id, 0, 100);
        const followedIds = followRes.data?.data || [];

        if (followedIds.length === 0) {
          setUsers([]);
          setLoading(false);
          return;
        }

        // 2. Fetch profiles for all followed users in parallel
        const profilePromises = followedIds.map(async (user) => {
          try {
            const profileRes = await authAPI.getProfile(user.id);
            return profileRes.data;
          } catch (err) {
            console.error(`Failed to fetch profile for user ${user.id}:`, err);
            return null;
          }
        });
        const profiles = (await Promise.all(profilePromises)).filter(Boolean);

        // 3. Fetch conversation list from backend
        let conversations = [];
        try {
          const convRes = await chatAPI.getConversations(currentUser.id);
          conversations = convRes.data?.data || convRes.data || [];
          console.log("Conversations fetched:", conversations);
        } catch (convErr) {
          console.error("Failed to fetch conversations from backend:", convErr);
        }

        // 4. Merge conversations with profiles
        const mergedUsers = profiles.map((p) => {
          const matchedConv = conversations.find((c) => c.userId === p.id);
          return {
            ...p,
            lastMessage: matchedConv ? matchedConv.lastMessage : null,
            lastMessageTimestamp: matchedConv ? matchedConv.lastMessageTimestamp : null,
            unreadCount: matchedConv ? matchedConv.unreadCount : 0,
            online: matchedConv ? matchedConv.online : false,
          };
        });

        // 5. Sort immediately: newest message first, nulls at bottom
        mergedUsers.sort((a, b) => {
          if (a.lastMessageTimestamp && b.lastMessageTimestamp) {
            return new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp);
          }
          if (a.lastMessageTimestamp) return -1;
          if (b.lastMessageTimestamp) return 1;
          return 0;
        });

        setUsers(mergedUsers);
      } catch (err) {
        console.error("Error fetching chat list users:", err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowedUsers();
  }, [currentUser?.id]);

  // Subscribe to real-time WebSocket messages to update preview and sorting immediately
  useEffect(() => {
    if (!currentUser?.id) return;
    const token = localStorage.getItem("token");

    const callback = (incomingMessage) => {
      const isRelevant = incomingMessage.senderId === currentUser.id || incomingMessage.receiverId === currentUser.id;
      if (!isRelevant) return;

      const otherUserId = incomingMessage.senderId === currentUser.id ? incomingMessage.receiverId : incomingMessage.senderId;

      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((user) => {
          if (user.id === otherUserId) {
            const isCurrentlyActive = activeUserId === otherUserId;
            return {
              ...user,
              lastMessage: incomingMessage.content,
              lastMessageTimestamp: incomingMessage.timestamp,
              unreadCount: isCurrentlyActive ? 0 : user.unreadCount + (incomingMessage.senderId === otherUserId ? 1 : 0),
            };
          }
          return user;
        });

        // Bubble to top instantly: sort by lastMessageTimestamp descending
        return [...updatedUsers].sort((a, b) => {
          if (a.lastMessageTimestamp && b.lastMessageTimestamp) {
            return new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp);
          }
          if (a.lastMessageTimestamp) return -1;
          if (b.lastMessageTimestamp) return 1;
          return 0;
        });
      });
    };

    connectWebSocket(token, "chat", callback);
    return () => {
      disconnectWebSocket("chat", callback);
    };
  }, [currentUser?.id, activeUserId]);

  // Clear unread indicator locally immediately when a user becomes active
  useEffect(() => {
    if (activeUserId) {
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === activeUserId ? { ...u, unreadCount: 0 } : u))
      );
    }
  }, [activeUserId]);

  // Dispatch the unread count to the header when users state changes
  useEffect(() => {
    const totalUnread = users.reduce((acc, u) => acc + (u.unreadCount || 0), 0);
    window.dispatchEvent(new CustomEvent("unread-count-updated", { detail: { count: totalUnread } }));
  }, [users]);

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
            const hasUnread = user.unreadCount > 0;
            const formattedTime = formatTimestamp(user.lastMessageTimestamp);
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
                  {/* Online status indicator dot */}
                  <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${user.online ? "bg-emerald-500" : "bg-slate-450"}`}></span>
                </div>

                {/* USER INFO */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {hasUnread && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" title="Unread conversation"></span>
                      )}
                      <p className="font-semibold text-slate-900 truncate">
                        {user.username}
                      </p>
                    </div>
                    {formattedTime && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        {formattedTime}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-xs text-slate-500 truncate flex-1">
                      {user.lastMessage || user.bio || "Click to message"}
                    </p>
                    {hasUnread && (
                      <span className="flex-shrink-0 min-w-[20px] h-5 px-1 bg-red-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(239,68,68,0.3)] animate-pulse">
                        {user.unreadCount > 99 ? "99+" : user.unreadCount}
                      </span>
                    )}
                  </div>
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
