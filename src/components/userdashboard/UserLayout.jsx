import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { authAPI, followAPI } from "../../services/api";
import DashboardHeader from "./UserHeader";

export default function UserLayout() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  let user = null;

  try {
    const stored = localStorage.getItem("user");
    user = stored ? JSON.parse(stored) : null;
  } catch {
    user = null;
  }

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const profileRes = await authAPI.getProfile(user.id);

        const [followersRes, followingRes] = await Promise.all([
          followAPI.getFollowersCount(user.id),
          followAPI.getFollowingCount(user.id),
        ]);

        setUserData({
          ...profileRes.data,
          followersCount: followersRes.data.followersCount || 0,
          followingCount: followingRes.data.followingCount || 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold shadow-sm">
          Loading RevHive...
        </div>
      </div>
    );
  }

  const profileData = userData || {
    id: user?.id,
    username: user?.username || "User",
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-950">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f6f8fc_42%,#eef4ff_100%)]" />
        <div className="absolute left-[-120px] top-[110px] h-[360px] w-[360px] rounded-full bg-cyan-200/35 blur-[90px]" />
        <div className="absolute right-[-160px] top-[210px] h-[440px] w-[440px] rounded-full bg-fuchsia-200/35 blur-[100px]" />
      </div>

      <DashboardHeader profileData={profileData} />

      <main className="w-full px-4 py-6 sm:px-5 lg:px-6 xl:px-8">
        <Outlet
          context={{
            profileData,
          }}
        />
      </main>
    </div>
  );
}
