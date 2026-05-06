import { useState } from "react";
import SettingsSidebar from "../../components/settings/SettingsSidebar";
import ProfileSection from "../../components/settings/ProfileSection";
import SecuritySection from "../../components/settings/SecuritySection";
import PreferencesSection from "../../components/settings/PreferencesSection";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1">
          {activeTab === "profile" && <ProfileSection />}
          {activeTab === "security" && <SecuritySection />}
          {activeTab === "preferences" && <PreferencesSection />}
        </div>
      </div>
    </div>
  );
}
