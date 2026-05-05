import { useState } from "react";
import SettingsTabs from "./SettingsTab";
import ProfileSection from "./sections/Profile";
import { Search } from "lucide-react";
import Password from "./sections/Password";
export default function SettingsLayout() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex flex-1 bg-gradient-to-b from-[#020617] to-[#050b1a] text-white min-h-screen">
      <div className="flex-1 flex justify-center px-6 py-8">
        <div className="w-full max-w-5xl">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-semibold">Settings</h1>
              <p className="text-sm text-gray-400">
                Manage your account preferences
              </p>
            </div>

            {/* SEARCH */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 w-72 backdrop-blur-md">
              <Search size={16} className="text-gray-400" />
              <input
                placeholder="Search..."
                className="bg-transparent outline-none text-sm w-full placeholder:text-gray-500"
              />
              <span className="text-xs text-gray-500">⌘K</span>
            </div>
          </div>

          {/* TABS */}
          <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* CONTENT */}
          <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            {activeTab === "profile" && <ProfileSection />}
            {activeTab === "password" && <Password />}
          </div>
        </div>
      </div>
    </div>
  );
}
