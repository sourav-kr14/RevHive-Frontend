import { useEffect, useState } from "react";
import AnalyticsCards from "./AnalyticsCard";
import GrowthChart from "./GrowthCard";
import { chartData } from "../../../data/dummyData";
import { adminAPI } from "../../../services/adminService";

export default function AdminDashboard() {
  const filters = ["12 months", "30 days", "7 days", "24 hours"];
  const [timeframe, setTimeframe] = useState("12 months");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const res = await adminAPI.getStats(timeframe);
        const statsData = res.data?.data ? res.data.data : res.data;
        setStats(statsData || null);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [timeframe]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>

        <div className="flex gap-2 flex-wrap">
          {filters.map((t) => {
            const isActive = timeframe === t;
            return (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-4 py-1.5 text-sm font-medium rounded-xl transition duration-350 cursor-pointer border ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white border-purple-500/20 shadow-md shadow-purple-950/20"
                    : "bg-white/5 border-transparent text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Analytics Cards */}
      <div
        className="bg-white/5 backdrop-blur-xl border border-white/10
        rounded-2xl p-4 shadow-xl"
      >
        {stats ? (
          <AnalyticsCards data={stats} />
        ) : (
          <div className="text-gray-400 text-center py-10">
            Loading stats...
          </div>
        )}
      </div>

      {/* Growth Chart */}
      <div
        className="bg-white/5 backdrop-blur-xl border border-white/10
        rounded-2xl p-4 shadow-xl"
      >
        {loading ? (
          <div className="text-gray-400 text-center py-20">
            Updating Growth curve...
          </div>
        ) : (
          <GrowthChart data={stats?.growth && stats.growth.length > 0 ? stats.growth : chartData} />
        )}
      </div>
    </div>
  );
}
