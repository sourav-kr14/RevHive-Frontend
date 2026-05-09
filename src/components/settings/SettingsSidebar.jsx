import {
  UserRound,
  ShieldCheck,
  SlidersHorizontal,
  CheckCircle2,
} from "lucide-react";

const tabs = [
  {
    id: "profile",
    label: "Profile",
    description: "Public identity",
    icon: UserRound,
    color:
      "from-fuchsia-500 to-pink-500 shadow-fuchsia-100 hover:bg-fuchsia-50 hover:text-fuchsia-700",
  },
  {
    id: "security",
    label: "Security",
    description: "Password safety",
    icon: ShieldCheck,
    color:
      "from-cyan-500 to-blue-500 shadow-cyan-100 hover:bg-cyan-50 hover:text-cyan-700",
  },
  {
    id: "preferences",
    label: "Preferences",
    description: "App experience",
    icon: SlidersHorizontal,
    color:
      "from-orange-500 to-amber-500 shadow-orange-100 hover:bg-orange-50 hover:text-orange-700",
  },
];

export default function SettingsSidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-full md:w-[300px] shrink-0">
      <div className="sticky top-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-extrabold text-slate-950">Settings</h2>
          <p className="mt-1 text-xs text-slate-500">
            Customize your RevHive account
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto p-3 md:flex-col">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`group flex min-w-[180px] items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-300 md:min-w-0 ${
                  isActive
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                    : `text-slate-600 ${tab.color}`
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-50 text-slate-500 group-hover:bg-white"
                  }`}
                >
                  <Icon size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-extrabold">{tab.label}</p>
                  <p
                    className={`mt-0.5 text-xs ${
                      isActive ? "text-white/75" : "text-slate-400"
                    }`}
                  >
                    {tab.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="hidden border-t border-slate-100 p-4 md:block">
          <div className="rounded-2xl bg-gradient-to-br from-fuchsia-50 to-cyan-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <p className="text-sm font-extrabold text-slate-950">
                Account active
              </p>
            </div>

            <p className="text-xs leading-5 text-slate-500">
              Your profile is visible and ready for community interactions.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
