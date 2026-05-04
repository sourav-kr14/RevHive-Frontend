import { motion } from "framer-motion";

export default function SettingsTab({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "profile", label: "My details" },
    { id: "password", label: "Password" },
    { id: "notifications", label: "Notifications" },
    { id: "billing", label: "Billing" },
  ];

  return (
    <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10 w-fit">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative px-4 py-2 text-sm rounded-lg"
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg shadow-md"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}

            <span
              className={`relative z-10 ${
                isActive ? "text-white" : "text-gray-400"
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
