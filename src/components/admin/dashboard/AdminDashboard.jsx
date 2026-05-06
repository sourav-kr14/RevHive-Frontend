import { useEffect, useState } from "react";
import AnalyticsCards from "./AnalyticsCard";
import GrowthChart from "./GrowthCard";
import { chartData } from "../../../data/dummyData";
import { adminAPI } from "../../../services/adminService";

export default function AdminDashboard() {
  const filters = ["12 months", "30 days", "7 days", "24 hours"];

  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await adminAPI.getStats();

        const data = res.data;

        setStats([
          {
            title: "Total Users",
            value: data.totalUsers,
            change: "+12%",
          },
          {
            title: "Active Users",
            value: data.activeUsers,
            change: "+8%",
          },
          {
            title: "Premium Users",
            value: data.premiumUsers,
            change: "+5%",
          },
          {
            title: "Blocked Users",
            value: data.blockedUsers,
            change: "-2%",
          },
          {
            title: "Admins",
            value: data.admins,
            change: "+1%",
          },
        ]);
      } catch (err) {
        console.error(err);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>

        <div className="flex gap-2 flex-wrap">
          {filters.map((t, i) => (
            <button
              key={t}
              className={`px-3 py-1.5 text-sm rounded-lg transition
              ${
                i === 0
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div
        className="bg-white/5 backdrop-blur-xl border border-white/10
        rounded-2xl p-4"
      >
        {stats && <AnalyticsCards data={stats} />}
      </div>

      {/* Chart */}
      <div
        className="bg-white/5 backdrop-blur-xl border border-white/10
        rounded-2xl p-4"
      >
        <GrowthChart data={chartData} />
      </div>
    </div>
  );
}
