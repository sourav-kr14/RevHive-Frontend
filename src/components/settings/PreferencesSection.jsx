import { useState } from "react";
import ToggleSwitch from "./ToggleSwitch";

export default function PreferencesSection() {
  const [newsletter, setNewsletter] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <h2 className="text-2xl font-semibold mb-8">Preferences</h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-5">
          <div>
            <h3 className="font-medium">Newsletter</h3>

            <p className="text-sm text-gray-500">Receive product updates</p>
          </div>

          <ToggleSwitch enabled={newsletter} setEnabled={setNewsletter} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Dark Mode</h3>

            <p className="text-sm text-gray-500">Toggle dark appearance</p>
          </div>

          <ToggleSwitch enabled={darkMode} setEnabled={setDarkMode} />
        </div>
      </div>
    </div>
  );
}
