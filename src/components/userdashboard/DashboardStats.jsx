export default function DashboardStats({ profileData }) {
  const stats = [
    { label: "Posts", value: profileData.postsCount || 0, color: "#60a5fa" },
    { label: "Followers", value: profileData.followersCount || 0, color: "#a78bfa" },
    { label: "Following", value: profileData.followingCount || 0, color: "#34d399" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-[#0c1120] border border-white/10 rounded-xl p-6 hover:border-white/20 hover:-translate-y-0.5 transition-all"
        >
          <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-3">{s.label}</p>
          <p
            className="text-4xl font-bold mb-3 tabular-nums leading-none"
            style={{ color: s.color }}
          >
            {s.value.toLocaleString()}
          </p>
          <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full w-3/5 rounded-full opacity-70"
              style={{ background: s.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

