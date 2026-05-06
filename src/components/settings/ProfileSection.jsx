import { useEffect, useState } from "react";
import AvatarUpload from "./AvatarUpload";
import InputField from "./InputField";
import { settingsAPI } from "../../services/settingsApi";
import { toast } from "sonner";

export default function ProfileSection() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    avatarUrl: "",
    dob: "",
    subscribeNewsletter: false,
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const data = await settingsAPI.getCurrentUser();

      setFormData({
        username: data.username || "",
        email: data.email || "",
        bio: data.bio || "",
        avatarUrl: data.avatarUrl || "",
        dob: data.dob || "",
        subscribeNewsletter: data.subscribeNewsletter || false,
      });
    } catch {
      toast.error("Failed to load profile");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      await settingsAPI.updateProfile({
        username: formData.username,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl,
        dob: formData.dob,
        subscribeNewsletter: formData.subscribeNewsletter,
      });

      toast.success("Profile updated");
    } catch {
      toast.error("Update failed");
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
            Profile Settings
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            Manage your personal information and preferences
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="
        h-11
        px-6
        rounded-2xl
        bg-green-400
        hover:bg-green-600
        text-white
        text-sm
        font-medium
        transition-all duration-200
        active:scale-[0.98]
        disabled:opacity-50
        hover:cursor-pointer
        "
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-8">
        {/* Avatar */}
        <div
          className="
        border border-gray-100
        rounded-3xl
        p-5
        bg-gray-50/70
        "
        >
          <AvatarUpload />
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="
          bg-gray-50/70
          border border-gray-100
          rounded-2xl
          p-4
          "
          >
            <InputField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div
            className="
          bg-gray-50/70
          border border-gray-100
          rounded-2xl
          p-4
          "
          >
            <InputField
              label="Email"
              type="email"
              value={formData.email}
              disabled
            />
          </div>

          <div
            className="
          bg-gray-50/70
          border border-gray-100
          rounded-2xl
          p-4
          "
          >
            <InputField
              label="Date of Birth"
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>

          <div
            className="
          bg-gray-50/70
          border border-gray-100
          rounded-2xl
          p-4
          "
          >
            <InputField
              label="Avatar URL"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Bio */}
        <div
          className="
        bg-gray-50/70
        border border-gray-100
        rounded-3xl
        p-5
        "
        >
          <label className="text-sm font-semibold text-black">Bio</label>

          <textarea
            rows="5"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Write something about yourself..."
            className="
          w-full
          mt-3
          border border-gray-200
          bg-white
          rounded-2xl
          px-4
          py-3
          text-black
          outline-none
          resize-none
          transition-all
          focus:ring-2
          focus:ring-black
          placeholder:text-gray-400
          "
          />
        </div>

        {/* Newsletter */}
        <div
          className="
        flex items-center justify-between
        bg-gray-50/70
        border border-gray-100
        rounded-2xl
        px-5
        py-4
        "
        >
          <div>
            <p className="text-sm font-semibold text-black">
              Newsletter Subscription
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Receive updates and announcements
            </p>
          </div>

          <input
            type="checkbox"
            name="subscribeNewsletter"
            checked={formData.subscribeNewsletter}
            onChange={handleChange}
            className="
          w-5 h-5
          accent-black
          cursor-pointer
          "
          />
        </div>
      </div>
    </div>
  );
}
