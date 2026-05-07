import { useEffect, useState } from "react";
import { AlertTriangle, ShieldAlert, CalendarDays, User } from "lucide-react";
import api from "@/services/api";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/reports/admin");
        setReports(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1120] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Reports Center</h1>

          <p className="text-gray-400 mt-2">
            Review and moderate reported content
          </p>
        </div>

        <div
          className="
          flex items-center gap-2
          px-4 py-2 rounded-2xl
          bg-red-500/10
          border border-red-500/20
        "
        >
          <ShieldAlert size={18} className="text-red-400" />

          <span className="text-red-300 text-sm font-medium">
            {reports.length} Reports
          </span>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="
                h-32 rounded-3xl
                bg-[#111827]
                border border-white/10
                animate-pulse
              "
            />
          ))}
        </div>
      ) : reports.length > 0 ? (
        <div className="space-y-5">
          {reports.map((r) => (
            <div
              key={r.id}
              className="
                group
                rounded-3xl
                bg-[#111827]
                border border-white/10
                p-6
                transition-all duration-300
                hover:border-red-500/20
                hover:shadow-[0_0_30px_rgba(239,68,68,0.08)]
              "
            >
              {/* Top */}
              <div className="flex items-start justify-between gap-4 mb-5">
                {/* Left */}
                <div className="flex items-start gap-4">
                  <div
                    className="
                      w-14 h-14 rounded-2xl
                      bg-red-500/10
                      flex items-center justify-center
                      border border-red-500/10
                    "
                  >
                    <AlertTriangle size={24} className="text-red-400" />
                  </div>

                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-lg font-semibold text-white">
                        Report #{r.id}
                      </h2>

                      <span
                        className="
                          px-3 py-1 rounded-full
                          text-xs font-medium
                          bg-purple-500/10
                          border border-purple-500/20
                          text-purple-300
                        "
                      >
                        {r.targetType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <User size={14} className="text-gray-500" />

                      <p className="text-sm text-gray-400">
                        Reported by{" "}
                        <span className="text-white font-medium">
                          @{r.reporterUsername}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div
                  className="
                    flex items-center gap-2
                    text-xs text-gray-500
                  "
                >
                  <CalendarDays size={14} />

                  {new Date(r.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Content */}
              <div className="grid md:grid-cols-2 gap-5">
                {/* Target */}
                <div
                  className="
                  rounded-2xl
                  bg-white/5
                  border border-white/5
                  p-4
                "
                >
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                    Target ID
                  </p>

                  <h3 className="text-white font-semibold break-all">
                    {r.targetId}
                  </h3>
                </div>

                {/* Reason */}
                <div
                  className="
                  rounded-2xl
                  bg-white/5
                  border border-white/5
                  p-4
                "
                >
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                    Reason
                  </p>

                  <p className="text-gray-300 leading-relaxed">{r.reason}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  className="
                    px-5 py-2.5 rounded-xl
                    bg-gradient-to-r
                    from-purple-500 to-blue-500
                    text-white text-sm font-medium
                    hover:opacity-90
                    transition
                  "
                >
                  Review
                </button>

                <button
                  className="
                    px-5 py-2.5 rounded-xl
                    bg-red-500/10
                    border border-red-500/20
                    text-red-400 text-sm font-medium
                    hover:bg-red-500/20
                    transition
                  "
                >
                  Take Action
                </button>

                <button
                  className="
                    px-5 py-2.5 rounded-xl
                    bg-white/5
                    border border-white/10
                    text-gray-300 text-sm font-medium
                    hover:bg-white/10
                    transition
                  "
                >
                  Ignore
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="
            rounded-3xl
            border border-dashed border-white/10
            bg-[#111827]/40
            py-24
            text-center
          "
        >
          <div
            className="
              w-20 h-20 rounded-3xl
              bg-white/5
              flex items-center justify-center
              mx-auto mb-5
            "
          >
            <ShieldAlert size={32} className="text-gray-500" />
          </div>

          <h2 className="text-xl font-semibold text-white mb-2">
            No reports found
          </h2>

          <p className="text-gray-400">Everything looks clean right now</p>
        </div>
      )}
    </div>
  );
}
