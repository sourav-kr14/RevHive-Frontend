import { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import ChatList from "./ChatList";
import UserHeader from "../userdashboard/UserHeader";
import { authAPI } from "../../services/api";

export default function MessagingLayout() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchProfile = async () => {
      try {
        const res = await authAPI.getProfile(currentUser.id);
        setProfileData(res.data);
      } catch (err) {
        console.error("Failed to load header profile data:", err);
      }
    };

    fetchProfile();
  }, [currentUser?.id]);

  const resolvedProfileData = profileData || {
    id: currentUser?.id,
    username: currentUser?.username || "User",
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-950 flex flex-col overflow-hidden">
      {/* Pastel background gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f6f8fc_42%,#eef4ff_100%)]" />
        <div className="absolute left-[-120px] top-[110px] h-[360px] w-[360px] rounded-full bg-cyan-200/35 blur-[90px]" />
        <div className="absolute right-[-160px] top-[210px] h-[440px] w-[440px] rounded-full bg-fuchsia-200/35 blur-[100px]" />
      </div>

      {/* HEADER */}
      <UserHeader profileData={resolvedProfileData} />

      {/* CHAT CONTAINER */}
      <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 py-4 md:py-6 sm:px-5 lg:px-6 xl:px-8 h-[calc(100vh-72px)] flex overflow-hidden">
        <div className="flex w-full h-full bg-white/70 border border-slate-200/80 rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(79,70,229,0.06)] backdrop-blur-xl">
          {/* LEFT SIDEBAR (CHAT LIST) */}
          <div className="w-80 border-r border-slate-200/80 h-full flex flex-col bg-white/40">
            <ChatList setSelectedUser={setSelectedUser} activeUserId={selectedUser?.id} />
          </div>

          {/* RIGHT PANEL (CHAT WINDOW) */}
          <div className="flex-1 flex flex-col h-full bg-slate-50/20">
            <ChatWindow selectedUser={selectedUser} />
          </div>
        </div>
      </div>
    </div>
  );
}
