import DashboardStats from "./UserStats";

export default function ProfileLayout({ profileData, children }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center text-white text-xl">
          {profileData?.username?.[0]?.toUpperCase()}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white">
            @{profileData?.username}
          </h2>
          <p className="text-gray-400 text-sm">
            {profileData?.bio || "No bio"}
          </p>
        </div>
      </div>

      <DashboardStats profileData={profileData} />

      {/* Page specific content */}
      <div>{children}</div>
    </div>
  );
}
