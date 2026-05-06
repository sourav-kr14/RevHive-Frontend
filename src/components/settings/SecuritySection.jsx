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
      <div
        className="
      flex flex-col sm:flex-row
      sm:items-center
      sm:justify-between
      gap-5
      mb-10
      "
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black">
            Security Settings
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Change your password and secure your account
          </p>
        </div>

        <button
          onClick={handleUpdatePassword}
          disabled={loading}
          className="
        h-11
        px-6
        rounded-2xl
        bg-green-400
        hover:bg-green-500
        text-white
        text-sm
        font-medium
        transition-all duration-200
        active:scale-[0.98]
        hover:cursor-pointer
        disabled:opacity-50
        "
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>

      {/* Password Fields */}
      <div className="space-y-5">
        <div
          className="
        bg-gray-50/70
        border border-gray-100
        rounded-2xl
        p-5
        "
        >
          <InputField
            label="Current Password"
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handleChange}
          />
        </div>

        <div
          className="
        bg-gray-50/70
        border border-gray-100
        rounded-2xl
        p-5
        "
        >
          <InputField
            label="New Password"
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handleChange}
          />
        </div>

        <div
          className="
        bg-gray-50/70
        border border-gray-100
        rounded-2xl
        p-5
        "
        >
          <InputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Security Tips */}
      <div
        className="
      mt-8
      bg-black
      rounded-3xl
      p-5
      text-white
      "
      >
        <p className="text-sm font-semibold">Password Tips</p>

        <ul className="mt-3 text-sm text-gray-300 space-y-2">
          <li>• Use at least 8 characters</li>
          <li>• Include uppercase and lowercase letters</li>
          <li>• Add numbers and special characters</li>
        </ul>
      </div>
    </div>
  );
}
