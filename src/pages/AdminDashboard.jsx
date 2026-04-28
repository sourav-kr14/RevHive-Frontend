import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("TOKEN USED:", token);

        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error("ERROR:", err);

        // if 403 → clear and redirect
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-10">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {!user ? (
        <p>Loading...</p>
      ) : Array.isArray(user) ? (
        <div className="grid md:grid-cols-3 gap-6">
          {user.map((u) => (
            <div
              key={u.id}
              className="bg-white/10 p-5 rounded-xl backdrop-blur hover:scale-105 transition"
            >
              <h2 className="text-xl font-semibold">{u.username}</h2>
              <p className="text-gray-300">{u.email}</p>
              <p className="text-sm text-green-400 mt-1">{u.role}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/10 p-6 rounded-xl backdrop-blur w-fit">
          <h2 className="text-2xl font-semibold">{user.username}</h2>
          <p className="text-gray-300">{user.email}</p>
          <p className="text-sm text-green-400 mt-1">{user.role}</p>
        </div>
      )}
    </div>
  );
}
