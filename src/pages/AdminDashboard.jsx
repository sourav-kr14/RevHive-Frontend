import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import api from "../api/api";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        // ✅ 1. Verify admin
        const resUser = await api.get("/auth/me");
        setUser(resUser.data);

        // ✅ 2. Fetch analytics
        const resAnalytics = await api.get("/admin/analytics");
        setAnalytics(resAnalytics.data);
      } catch (err) {
        console.error("ERROR:", err);

        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    init();
  }, []);

  if (!user || !analytics) {
    return <p className="text-white p-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-10">
      <h1 className="text-4xl font-bold mb-8">Admin Analytics Dashboard</h1>

      {/* 🔹 USER INFO */}
      <div className="mb-8 bg-white/10 p-6 rounded-xl backdrop-blur w-fit">
        <h2 className="text-xl font-semibold">{user.username}</h2>
        <p className="text-gray-300">{user.email}</p>
        <p className="text-sm text-green-400">{user.role}</p>
      </div>

      {/* 🔥 ANALYTICS CARDS */}
      <div className="grid md:grid-cols-5 gap-6 mb-10">
        <Card title="Total Users" value={analytics.totalUsers} />
        <Card title="Active Users" value={analytics.activeUsers} />
        <Card title="New Users" value={analytics.newUsers} />
        <Card title="DAU" value={analytics.dau} />
        <Card title="MAU" value={analytics.mau} />
      </div>

      {/* 📈 GROWTH CHART */}
      <div className="bg-white/10 p-6 rounded-xl backdrop-blur">
        <h2 className="text-2xl mb-4">User Growth</h2>

        <LineChart width={800} height={300} data={analytics.growth}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#444" />
          <Line type="monotone" dataKey="count" />
        </LineChart>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white/10 p-5 rounded-xl backdrop-blur text-center hover:scale-105 transition">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}
