import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { getCurrentUser, getAnalytics } from "../../services/adminService";
import Card from "../../components/admin/Card";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const load = async () => {
      const resUser = await getCurrentUser();
      const resAnalytics = await getAnalytics();

      setUser(resUser.data);
      setAnalytics(resAnalytics.data);
    };

    load();
  }, []);

  if (!user || !analytics) return <p>Loading...</p>;

  return (
    <>
      <h1 className="text-4xl mb-6">Dashboard</h1>

      <div className="grid md:grid-cols-5 gap-6 mb-10">
        <Card title="Total Users" value={analytics.totalUsers} />
        <Card title="Active Users" value={analytics.activeUsers} />
        <Card title="New Users" value={analytics.newUsers} />
        <Card title="DAU" value={analytics.dau} />
        <Card title="MAU" value={analytics.mau} />
      </div>

      <LineChart width={800} height={300} data={analytics.growth}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#444" />
        <Line type="monotone" dataKey="count" />
      </LineChart>
    </>
  );
}
