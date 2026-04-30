export default function DashboardCompose({ profileData, postText, setPostText }) {
  const initials = profileData.username
    ? profileData.username.slice(0, 2).toUpperCase()
    : "RH";

  return (
    <div className="bg-[#0c1120] border border-white/10 rounded-xl p-5 focus-within:border-blue-500/30 transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
          {initials}
        </div>
        <p className="text-sm text-gray-500">What's buzzing in the hive?</p>
      </div>
      <textarea
        className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-white placeholder-gray-700 resize-none outline-none text-sm leading-relaxed focus:border-blue-500/30 transition-all"
        placeholder="Share something with the hive…"
        rows="3"
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
      />
      <div className="flex items-center justify-between mt-3">
        <div className="flex gap-2">
          {["🖼", "🔗", "#"].map((icon) => (
            <button
              key={icon}
              className="w-8 h-8 rounded-lg border border-white/10 text-gray-500 hover:text-white hover:bg-white/5 transition-all text-sm"
            >
              {icon}
            </button>
          ))}
        </div>
        <button
          disabled={!postText.trim()}
          className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:opacity-90 hover:-translate-y-0.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          Post it
        </button>
      </div>
    </div>
  );
}

