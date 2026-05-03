import AnalyticsCards from "./AnalyticsCard";
import GrowthChart from "./GrowthCard";
import { dashboardData, chartData } from "../../../data/dummyData";

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

        <div className="flex gap-2">
          {["12 months", "30 days", "7 days", "24 hours"].map((t) => (
            <button
              key={t}
              className="px-3 py-1.5 text-sm border rounded-md bg-white hover:bg-gray-100"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <AnalyticsCards data={dashboardData} />

      <GrowthChart data={chartData} />
    </div>
  );
}
