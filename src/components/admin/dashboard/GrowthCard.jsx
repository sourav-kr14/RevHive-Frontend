import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function GrowthChart({ data = [] }) {
  return (
    <div
      className="bg-white/5 backdrop-blur-xl border border-white/10 
    rounded-2xl p-5 shadow-[0_0_20px_rgba(139,92,246,0.08)]"
    >
      <p className="text-sm font-semibold text-white mb-4">Growth</p>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          {/* Grid */}
          <CartesianGrid stroke="rgba(255,255,255,0.05)" />

          {/* Axes */}
          <XAxis dataKey="date" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              background: "#0b0f1a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              color: "#fff",
            }}
            labelStyle={{ color: "#9ca3af" }}
          />

          {/* Line */}
          <Line
            type="monotone"
            dataKey="count"
            stroke="url(#gradient)"
            strokeWidth={3}
            dot={false}
          />

          {/* Gradient */}
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
