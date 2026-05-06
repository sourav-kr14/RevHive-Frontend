import { useState } from "react";
import InputField from "./InputField";
import { settingsAPI } from "../../services/settingsApi";
import { toast } from "sonner";

export default function SecuritySection() {
  const [loading, setLoading] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await settingsAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password updated");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      toast.error("Password update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-semibold">Security</h2>

          <p className="text-gray-500 text-sm mt-1">Update your password</p>
        </div>

        <button
          onClick={handleUpdatePassword}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <InputField
          label="Current Password"
          type="password"
          name="currentPassword"
          value={passwordData.currentPassword}
          onChange={handleChange}
        />

        <InputField
          label="New Password"
          type="password"
          name="newPassword"
          value={passwordData.newPassword}
          onChange={handleChange}
        />

        <InputField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={passwordData.confirmPassword}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
