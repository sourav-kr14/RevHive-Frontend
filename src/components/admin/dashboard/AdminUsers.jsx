import { useEffect, useState } from "react";
import { adminAPI } from "../../../services/adminService";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminAPI.getAllUsers();
        setUsers(res?.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="text-gray-400 text-center py-10">Loading users...</div>
    );
  }

  if (error) {
    return <div className="text-red-400 text-center py-10">{error}</div>;
  }

  if (users.length === 0) {
    return (
      <div className="text-gray-400 text-center py-10">No users found</div>
    );
  }

  return (
    <div
      className="bg-white/5 backdrop-blur-xl border border-white/10 
      rounded-2xl p-5 shadow-[0_0_20px_rgba(139,92,246,0.08)]"
    >
      <h1 className="text-2xl font-semibold mb-5 text-white">Users</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Head */}
          <thead className="text-gray-400 border-b border-white/10">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-white/5 hover:bg-white/5 transition"
              >
                <td className="px-4 py-3 text-gray-300">{u?.id}</td>

                <td className="px-4 py-3 text-white font-medium">
                  {u?.username || "N/A"}
                </td>

                <td className="px-4 py-3 text-gray-400">{u?.email || "N/A"}</td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-md
                      ${
                        u?.role === "ADMIN"
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                  >
                    {u?.role || "USER"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
