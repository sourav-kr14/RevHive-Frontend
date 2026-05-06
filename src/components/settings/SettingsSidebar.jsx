const tabs = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security" },
  { id: "preferences", label: "Preferences" },
];

export default function SettingsSidebar({ activeTab, setActiveTab }) {
  return (
    <div
      className="
      bg-white/80 backdrop-blur-xl
      border border-sky-100
      rounded-[30px]
      shadow-sm
      p-3
      md:w-64
      "
    >
      <div className="flex md:flex-col gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-3
              rounded-2xl
              text-sm font-medium
              text-left
              whitespace-nowrap
              transition-all duration-300
              ${
                activeTab === tab.id
                  ? `
                    bg-gradient-to-r
                    from-red-500
                    to-orange-500
                    text-white
                    shadow-lg shadow-white
                    scale-[1.02]
                  `
                  : `
                    text-gray-600
                    hover:bg-red-400
                    hover:text-white
                  `
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
