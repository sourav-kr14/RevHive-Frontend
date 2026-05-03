import { useState } from "react";
import SettingsTabs from "./SettingsTab";
import ProfileSection from "./sections/Profile";

export default function SettingsLayout() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex flex-1 bg-gray-50">
      {/* MAIN CONTENT */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-4xl px-6 py-6">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>

            {/* Search */}
            <div className="border rounded-lg px-3 py-2 bg-white text-sm text-gray-500">
              Search ⌘K
            </div>
          </div>

          {/* TABS */}
          <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* CONTENT */}
          <div className="mt-6">
            {activeTab === "profile" && <ProfileSection />}
          </div>
        </div>
      </div>
    </div>
  );
}
