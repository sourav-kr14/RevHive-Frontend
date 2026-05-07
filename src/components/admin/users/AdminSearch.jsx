import { useEffect, useState } from "react";
import { Search, ShieldCheck, Crown, User } from "lucide-react";
import api from "@/services/api";

export default function AdminSearch() {
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
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/users/search?query=${query}`);

      setUsers(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Search Users</h1>

        <p className="text-gray-400 mt-2">Search and manage platform users</p>
      </div>

      {/* Search Box */}
      <div
        className="
        flex items-center gap-3
        px-5 py-4
        rounded-2xl
        bg-[#111827]
        border border-white/10
        shadow-lg
        mb-8
      "
      >
        <Search size={20} className="text-gray-500" />

        <input
          type="text"
          placeholder="Search username or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="
            bg-transparent
            outline-none
            text-white
            placeholder:text-gray-500
            w-full
          "
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="
                h-36 rounded-3xl
                bg-[#111827]
                animate-pulse
              "
            />
          ))}
        </div>
      )}

      {/* Users */}
      {!loading && users.length > 0 && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {users.map((user) => (
            <div
              key={user.id}
              className="
                rounded-3xl
                bg-[#111827]
                border border-white/10
                p-5
                hover:border-purple-500/30
                transition-all duration-300
                hover:translate-y-[-2px]
              "
            >
              {/* Top */}
              <div className="flex items-center gap-4 mb-5">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="
                      w-16 h-16 rounded-2xl
                      object-cover
                    "
                  />
                ) : (
                  <div
                    className="
                      w-16 h-16 rounded-2xl
                      bg-gradient-to-br
                      from-purple-500
                      to-blue-500
                      flex items-center justify-center
                      text-white
                    "
                  >
                    <User size={28} />
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2
                      className="
                        text-lg font-semibold text-white
                        truncate
                      "
                    >
                      {user.username}
                    </h2>

                    {user.role === "ADMIN" && (
                      <ShieldCheck size={16} className="text-violet-400" />
                    )}

                    {user.premium && (
                      <Crown size={16} className="text-yellow-400" />
                    )}
                  </div>

                  <p className="text-sm text-gray-400 truncate">{user.email}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div
                  className="
                  rounded-2xl
                  bg-white/5
                  p-3
                "
                >
                  <p className="text-xs text-gray-400 mb-1">Followers</p>

                  <h3 className="text-white font-semibold">
                    {user.followersCount || 0}
                  </h3>
                </div>

                <div
                  className="
                  rounded-2xl
                  bg-white/5
                  p-3
                "
                >
                  <p className="text-xs text-gray-400 mb-1">Following</p>

                  <h3 className="text-white font-semibold">
                    {user.followingCount || 0}
                  </h3>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  className="
                    flex-1 py-2.5 rounded-xl
                    bg-gradient-to-r
                    from-purple-500 to-blue-500
                    text-white text-sm font-medium
                    hover:opacity-90
                    transition
                  "
                >
                  View Profile
                </button>

                <button
                  className="
                    px-4 py-2.5 rounded-xl
                    bg-red-500/10
                    border border-red-500/20
                    text-red-400 text-sm
                    hover:bg-red-500/20
                    transition
                  "
                >
                  Ban
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && query && users.length === 0 && (
        <div
          className="
            rounded-3xl
            border border-dashed border-white/10
            py-20
            text-center
          "
        >
          <div
            className="
              w-20 h-20 rounded-3xl
              bg-white/5
              flex items-center justify-center
              mx-auto mb-5
            "
          >
            <Search size={32} className="text-gray-500" />
          </div>

          <h2 className="text-xl font-semibold text-white mb-2">
            No users found
          </h2>

          <p className="text-gray-400">Try searching another username</p>
        </div>
      )}
    </div>
  );
}
