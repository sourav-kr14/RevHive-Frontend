import { useEffect, useState } from "react";
import { getAllUsers } from "../../../services/adminService";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAllUsers();

        console.log("API RESPONSE:", res);

        setUsers(res.data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading users...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (users.length === 0) {
    return <p className="text-gray-500">No users found</p>;
  }

  return (
    <div className="bg-white border rounded-xl p-4">
      <h1 className="text-2xl font-semibold mb-4 text-gray-900">Users</h1>

      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="px-4 py-2">{u.id}</td>
              <td className="px-4 py-2">{u.username}</td>
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
