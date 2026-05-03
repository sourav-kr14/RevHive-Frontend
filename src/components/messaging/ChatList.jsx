export default function ChatList({ setSelectedUser }) {
  const users = [
    { id: 1, name: "User1", online: true },
    { id: 2, name: "User2", online: false },
  ];

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Messages</h2>

      {users.map((user) => (
        <div
          key={user.id}
          onClick={() => setSelectedUser(user)}
          className="p-3 rounded-xl hover:bg-white/10 cursor-pointer transition"
        >
          <p className="font-medium">{user.name}</p>
          <span
            className={`text-sm ${user.online ? "text-green-400" : "text-gray-500"}`}
          >
            {user.online ? "Online" : "Offline"}
          </span>
        </div>
      ))}
    </div>
  );
}
