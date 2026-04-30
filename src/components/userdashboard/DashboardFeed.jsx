export default function DashboardFeed({ profileData }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-200">Your Feed</h2>
        <button className="text-xs text-gray-500 border border-white/10 bg-[#0c1120] rounded-lg px-3 py-1.5 hover:text-white hover:border-white/20 transition-all">
          Latest ▾
        </button>
      </div>
      {profileData.postsCount > 0 ? (
        <div className="flex flex-col gap-4">
          {/* Posts will render here once feed API is connected */}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-[#0c1120] border border-white/10 border-dashed rounded-xl text-center">
          <div className="text-4xl mb-4">🐝</div>
          <p className="text-gray-300 font-medium mb-1">The hive is quiet</p>
          <p className="text-gray-600 text-sm">Follow people or create a post to get started</p>
        </div>
      )}
    </div>
  );
}

