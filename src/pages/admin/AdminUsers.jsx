import { useEffect, useState } from "react";
import { getAllUsers } from "../../services/adminService";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await getAllUsers();
      setUsers(res.data);
    };

    load();
  }, []);

  return (
    <div>
      <h1 className="text-3xl mb-6">Users</h1>

      <table className="w-full">
        <thead>
          <tr className="text-gray-400">
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t border-gray-700">
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
