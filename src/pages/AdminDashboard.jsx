import { useEffect, useState } from "react";
import api from "../api/api";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>

      {user ? (
        <div className="bg-white/10 p-6 rounded-xl backdrop-blur">
          <img
            src={user.avatarUrl}
            alt="avatar"
            className="w-20 h-20 rounded-full mb-4"
          />
          <h2 className="text-2xl">{user.username}</h2>
          <p>{user.email}</p>
          <p className="mt-2 text-gray-300">{user.bio}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
