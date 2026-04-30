export default function DashboardHeader({ profileData }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Good to see you back</p>
        <h1 className="text-3xl font-bold text-gray-100">
          {profileData.username} <span>👋</span>
        </h1>
      </div>
      <div className="flex gap-2">
        <button className="w-10 h-10 rounded-xl border border-white/10 bg-[#0c1120] text-gray-400 hover:text-blue-400 hover:border-blue-500/30 transition-all flex items-center justify-center">
          🔔
        </button>
        <button className="w-10 h-10 rounded-xl border border-white/10 bg-[#0c1120] text-gray-400 hover:text-blue-400 hover:border-blue-500/30 transition-all flex items-center justify-center">
          ✉
        </button>
      </div>
    </div>
  );
}

