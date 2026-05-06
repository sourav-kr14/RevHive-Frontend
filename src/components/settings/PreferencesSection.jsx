import { useState } from "react";
import ToggleSwitch from "./ToggleSwitch";

export default function PreferencesSection() {
  const [newsletter, setNewsletter] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className="
      bg-white/90 backdrop-blur-md
      border border-gray-100
      rounded-[32px]
      shadow-sm hover:shadow-xl
      transition-all duration-300
      p-6 sm:p-8
      "
    >
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-black">
          Preferences
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Customize your experience and notifications
        </p>
      </div>

      {/* Settings */}
      <div className="space-y-5">
        {/* Newsletter */}
        <div
          className="
          flex items-center justify-between
          bg-gray-50/70
          border border-gray-100
          rounded-3xl
          px-5 py-5
          "
        >
          <div>
            <h3 className="text-base font-semibold text-black">Newsletter</h3>

            <p className="text-sm text-gray-500 mt-1">
              Receive product updates and announcements
            </p>
          </div>

          <ToggleSwitch enabled={newsletter} setEnabled={setNewsletter} />
        </div>

        {/* Dark Mode */}
        <div
          className="
          flex items-center justify-between
          bg-gray-50/70
          border border-gray-100
          rounded-3xl
          px-5 py-5
          "
        >
          <div>
            <h3 className="text-base font-semibold text-black">Dark Mode</h3>

            <p className="text-sm text-gray-500 mt-1">
              Toggle dark appearance for the app
            </p>
          </div>

          <ToggleSwitch enabled={darkMode} setEnabled={setDarkMode} />
        </div>
      </div>
    </div>
  );
}
