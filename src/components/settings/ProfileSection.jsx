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
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-black">
            Profile Settings
          </h2>

          <p className="text-black text-sm mt-1">
            Update your profile information
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="
          bg-purple-600
          hover:bg-purple-700
          text-black
          px-5
          py-2
          rounded-xl
          transition
          "
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="space-y-8">
        <AvatarUpload />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />

          <InputField
            label="Email"
            type="email"
            value={formData.email}
            disabled
          />

          <InputField
            label="Date of Birth"
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />

          <InputField
            label="Avatar URL"
            name="avatarUrl"
            value={formData.avatarUrl}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-black">Bio</label>

          <textarea
            rows="5"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Write something..."
            className="
            w-full
            mt-2
            border
            border-gray-300
            bg-white
            text-black
            rounded-xl
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-purple-500
            placeholder:text-gray-400
            "
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="subscribeNewsletter"
            checked={formData.subscribeNewsletter}
            onChange={handleChange}
            className="w-4 h-4 accent-purple-600"
          />

          <label className="text-sm text-black">Subscribe to newsletter</label>
        </div>
      </div>
    </div>
  );
}
