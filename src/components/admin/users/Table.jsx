export default function UsersTable({ users }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        {/* Head */}
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="text-left px-4 py-3">User</th>
            <th className="text-left px-4 py-3">Email</th>
            <th className="text-left px-4 py-3">Role</th>
            <th className="text-left px-4 py-3">Status</th>
            <th className="text-right px-4 py-3">Actions</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              {/* User */}
              <td className="px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>

                <span className="font-medium text-gray-900">{user.name}</span>
              </td>

              {/* Email */}
              <td className="px-4 py-3 text-gray-600">{user.email}</td>

              {/* Role */}
              <td className="px-4 py-3 text-gray-600">{user.role}</td>

              {/* Status */}
              <td className="px-4 py-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {user.status}
                </span>
              </td>

              {/* Actions */}
              <td className="px-4 py-3 text-right">
                <button className="text-gray-500 hover:text-black text-sm">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
