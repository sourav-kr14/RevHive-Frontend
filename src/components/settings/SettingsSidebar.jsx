const tabs = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security" },
  { id: "preferences", label: "Preferences" },
];

export default function SettingsSidebar({ activeTab, setActiveTab }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-3 md:w-64">
      <div className="flex md:flex-col gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 rounded-xl text-left transition whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-purple-600 text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
