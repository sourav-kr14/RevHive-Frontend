import { useEffect, useState } from "react";
import AvatarUpload from "./AvatarUpload";
import InputField from "./InputField";
import { settingsAPI } from "../../services/settingsApi";
import { toast } from "sonner";
import {
  Save,
  ShieldCheck,
  Mail,
  CalendarDays,
  UserRound,
  Image,
  CheckCircle2,
  Bell,
  BadgeCheck,
  Eye,
} from "lucide-react";

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

  const completionItems = [
    Boolean(formData.username),
    Boolean(formData.email),
    Boolean(formData.bio),
    Boolean(formData.avatarUrl),
    Boolean(formData.dob),
  ];

  const completion = Math.round(
    (completionItems.filter(Boolean).length / completionItems.length) * 100,
  );

  return (
    <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                <UserRound size={14} />
                Account profile
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                Profile Settings
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage your public identity, profile details, and communication
                preferences.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-red-500 px-5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 hover:cursor-pointer"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4">
              <p className="text-sm font-semibold text-slate-950">
                Profile photo
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Upload or update the image people see across RevHive.
              </p>
            </div>

            <AvatarUpload />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="profile-field">
              <div className="profile-icon">
                <UserRound size={18} />
              </div>
              <InputField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="profile-field">
              <div className="profile-icon">
                <Mail size={18} />
              </div>
              <InputField
                label="Email"
                type="email"
                value={formData.email}
                disabled
              />
            </div>

            <div className="profile-field">
              <div className="profile-icon">
                <CalendarDays size={18} />
              </div>
              <InputField
                label="Date of Birth"
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>

            <div className="profile-field">
              <div className="profile-icon">
                <Image size={18} />
              </div>
              <InputField
                label="Avatar URL"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold text-slate-950">
                  Bio
                </label>
                <p className="mt-1 text-xs text-slate-500">
                  A short introduction shown on your profile.
                </p>
              </div>

              <span className="text-xs font-semibold text-slate-400">
                {formData.bio.length}/180
              </span>
            </div>

            <textarea
              rows="5"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              maxLength={180}
              placeholder="Write something about yourself..."
              className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <Bell size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-950">
                  Newsletter Subscription
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Receive product updates and community highlights.
                </p>
              </div>
            </div>

            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                name="subscribeNewsletter"
                checked={formData.subscribeNewsletter}
                onChange={handleChange}
                className="peer sr-only"
              />
              <span className="h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-slate-950" />
              <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
            </label>
          </div>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-24 bg-slate-950" />

          <div className="px-5 pb-5">
            <div className="-mt-8 flex items-end justify-between">
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt={formData.username}
                  className="h-16 w-16 rounded-xl border-4 border-white object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl border-4 border-white bg-slate-800 text-lg font-bold text-white shadow-sm">
                  {(formData.username || "U").charAt(0).toUpperCase()}
                </div>
              )}

              <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <BadgeCheck size={14} />
                Active
              </div>
            </div>

            <div className="mt-4">
              <p className="text-lg font-bold text-slate-950">
                @{formData.username || "username"}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {formData.bio ||
                  "Your bio preview will appear here as you write it."}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-lg font-bold text-slate-950">0</p>
                <p className="text-xs font-medium text-slate-500">Followers</p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-lg font-bold text-slate-950">0</p>
                <p className="text-xs font-medium text-slate-500">Following</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-950">
                Profile completion
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Improve your account visibility.
              </p>
            </div>

            <span className="text-sm font-bold text-slate-950">
              {completion}%
            </span>
          </div>

          <div className="h-2 rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-slate-950 transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>

          <div className="mt-4 space-y-2">
            {[
              ["Username added", Boolean(formData.username)],
              ["Email connected", Boolean(formData.email)],
              ["Bio written", Boolean(formData.bio)],
              ["Avatar added", Boolean(formData.avatarUrl)],
              ["Date of birth added", Boolean(formData.dob)],
            ].map(([label, done]) => (
              <div
                key={label}
                className="flex items-center gap-2 text-xs font-semibold"
              >
                <CheckCircle2
                  size={15}
                  className={done ? "text-emerald-500" : "text-slate-300"}
                />
                <span className={done ? "text-slate-700" : "text-slate-400"}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <Eye size={18} />
          </div>

          <p className="text-sm font-bold text-slate-950">Public visibility</p>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Your username, avatar, and bio may be visible to other users across
            RevHive.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white">
            <ShieldCheck size={18} />
          </div>

          <p className="text-sm font-bold">Profile safety</p>
          <p className="mt-2 text-xs leading-5 text-white/60">
            Keep your profile details accurate and avoid sharing sensitive
            personal information publicly.
          </p>
        </div>
      </aside>

      <style>{`
        .profile-field {
          display: grid;
          grid-template-columns: 42px minmax(0, 1fr);
          gap: 12px;
          align-items: start;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          border-radius: 12px;
          padding: 14px;
        }

        .profile-icon {
          display: flex;
          height: 42px;
          width: 42px;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #f1f5f9;
          color: #475569;
        }
      `}</style>
    </div>
  );
}
