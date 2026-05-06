import { useEffect, useState } from "react";
import { adminAPI } from "../../../services/adminService";

export default function AdminPremium() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPremiumUsers = async () => {
      try {
        const res = await adminAPI.getAllUsers();

        // filter premium users
        const premiumUsers = (res?.data || []).filter(
          (u) =>
            u.role === "PREMIUM" || u.premium === true || u.is_premium === 1,
        );

        setUsers(premiumUsers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPremiumUsers();
  }, []);

  if (loading) {
    return (
      <div className="text-gray-400 text-center py-10">
        Loading premium users...
      </div>
    );
  }

  return (
    <div
      className="bg-white/5 backdrop-blur-xl border border-white/10
      rounded-2xl p-5 shadow-[0_0_20px_rgba(139,92,246,0.08)]"
    >
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-semibold text-white">Premium Users</h1>

        <div
          className="px-3 py-1 rounded-lg
          bg-yellow-500/20 text-yellow-400 text-sm"
        >
          {users.length} Premium
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-gray-400 border-b border-white/10">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Username</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Premium</th>
              <th className="px-4 py-3 text-left">Expiry</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-white/5 hover:bg-white/5 transition"
              >
                <td className="px-4 py-3 text-gray-300">{u.id}</td>

                <td className="px-4 py-3 text-white font-medium">
                  {u.username}
                </td>

                <td className="px-4 py-3 text-gray-400">{u.email}</td>

                <td className="px-4 py-3">
                  <span
                    className="px-2 py-1 text-xs rounded-md
                    bg-yellow-500/20 text-yellow-400"
                  >
                    PREMIUM
                  </span>
                </td>

                <td className="px-4 py-3 text-gray-400">
                  {u.premium_expiry || "No Expiry"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
