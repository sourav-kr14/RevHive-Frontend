import AnalyticsCards from "./AnalyticsCard";
import GrowthChart from "./GrowthCard";
import { dashboardData, chartData } from "../../../data/dummyData";

export default function AdminDashboard() {
  const filters = ["12 months", "30 days", "7 days", "24 hours"];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>

        <div className="flex gap-2">
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
        <AnalyticsCards data={dashboardData} />
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
