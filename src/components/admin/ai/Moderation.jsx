import React from "react";
import { ShieldAlert, CheckCircle, AlertTriangle, Bot } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getModerationResults,
  getModerationStats,
  approveModeration,
  removeModeration,
  getRecentActivity,
  getAnalytics,
} from "../../../services/moderationApi";
import { motion } from "framer-motion";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Moderation = () => {
  const [moderationData, setModerationData] = useState([]);
  const [stats, setStats] = useState({
    flagged: 0,
    safe: 0,
    removed: 0,
    toxicityRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    fetchModerationData();

    const interval = setInterval(() => {
      fetchModerationData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  const fetchModerationData = async () => {
    try {
      const response = await getModerationResults();

      setModerationData(response.data);
      const statsResponse = await getModerationStats();

      setStats(statsResponse.data);
      const activityResponse = await getRecentActivity();

      setRecentActivity(activityResponse.data);
      
      const analyticsResponse = await getAnalytics();
      setChartData(analyticsResponse.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleApprove = async (id) => {
    try {
      await approveModeration(id);

      fetchModerationData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeModeration(id);

      fetchModerationData();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#0f172a] p-6 text-white"
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Moderation Dashboard</h1>

          <p className="mt-1 text-gray-400">
            Monitor toxic content, spam, and AI moderation activity
          </p>
        </div>

        <div
          className="flex items-center gap-2 rounded-xl
          border border-green-500/20 bg-green-500/10
          px-4 py-2 text-sm text-green-400"
        >
          <div className="h-2 w-2 rounded-full bg-green-400" />
          AI Engine Active
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Flagged Posts",
            value: stats.flagged,
            color: "text-red-400",
          },
          {
            title: "Safe Posts",
            value: stats.safe,
            color: "text-green-400",
          },
          {
            title: "Removed",
            value: stats.removed,
            color: "text-yellow-400",
          },
          {
            title: "Toxicity Rate",
            value: `${stats.toxicityRate}%`,
            color: "text-purple-400",
          },
        ].map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{
              scale: 1.03,
            }}
            className="rounded-2xl border border-white/5 bg-[#1e293b] p-5"
          >
            <p className="text-gray-400">{card.title}</p>

            <h2 className={`mt-3 text-3xl font-bold ${card.color}`}>
              {card.value}
            </h2>
          </motion.div>
        ))}
      </div>
      {/* Live AI Activity */}
      <div className="mb-8 rounded-2xl border border-white/5 bg-[#1e293b] p-5">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="text-purple-400" size={22} />

            <h2 className="text-xl font-bold">Live AI Activity</h2>
          </div>

          <span className="text-sm text-green-400">Online</span>
        </div>

        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <motion.div
              key={activity.id}
              whileHover={{ scale: 1.01 }}
              className={`flex items-center gap-3 rounded-xl p-4 border ${
                activity.status === "PENDING"
                  ? "border-red-500/20 bg-red-500/10"
                  : activity.status === "REMOVED"
                    ? "border-yellow-500/20 bg-yellow-500/10"
                    : "border-green-500/20 bg-green-500/10"
              }`}
            >
              {activity.status === "PENDING" ? (
                <ShieldAlert className="text-red-400" size={18} />
              ) : activity.status === "REMOVED" ? (
                <AlertTriangle className="text-yellow-400" size={18} />
              ) : (
                <CheckCircle className="text-green-400" size={18} />
              )}

              <div>
                <p className="font-medium">
                  {activity.status === "PENDING"
                    ? "Toxic content detected"
                    : activity.status === "REMOVED"
                      ? "Content removed"
                      : "Safe content approved"}
                </p>

                <p className="text-sm text-gray-400">User #{activity.userId}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Analytics */}
      <div className="mb-8 rounded-2xl border border-white/5 bg-[#1e293b] p-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">Toxicity Analytics</h2>

          <span className="text-sm text-gray-400">Last 7 days</span>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

              <XAxis dataKey="day" stroke="#94a3b8" />

              <YAxis stroke="#94a3b8" />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="toxicity"
                stroke="#8b5cf6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Moderation Table */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#1e293b]">
        <div className="border-b border-white/5 p-5">
          <h2 className="text-xl font-bold">Moderation Queue</h2>
        </div>

        <table className="w-full">
          <thead className="bg-[#334155] text-left">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Content</th>
              <th className="p-4">Toxicity</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {moderationData.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">
                  No moderation records found
                </td>
              </tr>
            )}
            {moderationData.map((item) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                }}
                className="border-t border-slate-700"
              >
                <td className="p-4 font-medium">User #{item.userId}</td>

                <td className="p-4 text-gray-300">{item.content}</td>

                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-32 rounded-full bg-slate-700">
                      <div
                        className={`h-2 rounded-full ${
                          item.toxicityScore > 70
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${
                            item.toxicityScore > 1
                              ? item.toxicityScore
                              : item.toxicityScore * 100
                          }%`,
                        }}
                      />
                    </div>

                    <span>
                      {item.toxicityScore > 1
                        ? item.toxicityScore
                        : Math.round(item.toxicityScore * 100)}
                      %
                    </span>
                  </div>
                </td>

                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      item.status === "PENDING"
                        ? "bg-red-500/20 text-red-400"
                        : item.status === "REMOVED"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="flex gap-2 p-4">
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="rounded-lg bg-green-600
  px-3 py-1 transition hover:bg-green-700"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="rounded-lg bg-red-600
  px-3 py-1 transition hover:bg-red-700"
                  >
                    Remove
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Moderation;
