import { useState } from "react";
import InputField from "./InputField";
import { settingsAPI } from "../../services/settingsApi";
import { toast } from "sonner";
import {
  ShieldCheck,
  LockKeyhole,
  Save,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  Fingerprint,
  Eye,
} from "lucide-react";

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
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;

    if (!passwordRegex.test(newPassword)) {
      toast.error(
        "Password must contain uppercase, lowercase, number and special character",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("New password cannot be same as current password");
      return;
    }

    try {
      setLoading(true);

      await settingsAPI.changePassword({
        currentPassword,
        newPassword,
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

  const checks = [
    {
      label: "At least 8 characters",
      done: passwordData.newPassword.length >= 8,
    },
    {
      label: "Uppercase letter",
      done: /[A-Z]/.test(passwordData.newPassword),
    },
    {
      label: "Lowercase letter",
      done: /[a-z]/.test(passwordData.newPassword),
    },
    {
      label: "Number included",
      done: /\d/.test(passwordData.newPassword),
    },
    {
      label: "Special character",
      done: /[@$!%*?&]/.test(passwordData.newPassword),
    },
  ];

  const strength = Math.round(
    (checks.filter((item) => item.done).length / checks.length) * 100,
  );

  return (
    <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="relative bg-gradient-to-r from-slate-950 via-violet-950 to-fuchsia-700 px-6 py-7 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.20),transparent_28%),radial-gradient(circle_at_90%_0%,rgba(34,211,238,0.24),transparent_28%)]" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold backdrop-blur">
                <ShieldCheck size={14} />
                Account protection
              </div>

              <h2 className="text-3xl font-black tracking-tight">
                Security Settings
              </h2>

              <p className="mt-2 text-sm text-white/70">
                Change your password and keep your RevHive account protected.
              </p>
            </div>

            <button
              type="button"
              onClick={handleUpdatePassword}
              disabled={loading}
              className="hidden h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-slate-950 shadow-sm transition hover:bg-cyan-50 disabled:opacity-60 sm:flex"
            >
              <Save size={16} />
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="security-field">
            <div className="security-icon bg-orange-50 text-orange-600">
              <KeyRound size={18} />
            </div>

            <InputField
              label="Current Password"
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handleChange}
            />
          </div>

          <div className="security-field">
            <div className="security-icon bg-fuchsia-50 text-fuchsia-600">
              <LockKeyhole size={18} />
            </div>

            <InputField
              label="New Password"
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handleChange}
            />
          </div>

          <div className="security-field">
            <div className="security-icon bg-cyan-50 text-cyan-600">
              <Fingerprint size={18} />
            </div>

            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            type="button"
            onClick={handleUpdatePassword}
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-60 sm:hidden"
          >
            <Save size={16} />
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-2xl border border-fuchsia-100 bg-gradient-to-br from-fuchsia-50 to-cyan-50 p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-extrabold text-slate-950">
                Password strength
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Build a stronger password
              </p>
            </div>

            <span className="text-sm font-black text-fuchsia-700">
              {strength}%
            </span>
          </div>

          <div className="h-2 rounded-full bg-white">
            <div
              className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 transition-all"
              style={{ width: `${strength}%` }}
            />
          </div>

          <div className="mt-4 space-y-2">
            {checks.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-xs font-bold"
              >
                <CheckCircle2
                  size={15}
                  className={item.done ? "text-emerald-500" : "text-slate-300"}
                />
                <span
                  className={item.done ? "text-slate-700" : "text-slate-400"}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-cyan-300">
            <ShieldCheck size={18} />
          </div>

          <p className="text-sm font-extrabold">Security tips</p>

          <div className="mt-4 space-y-3">
            <div className="flex gap-3">
              <CheckCircle2 size={16} className="mt-0.5 text-emerald-300" />
              <p className="text-xs leading-5 text-white/65">
                Avoid reusing passwords from other apps or websites.
              </p>
            </div>

            <div className="flex gap-3">
              <CheckCircle2 size={16} className="mt-0.5 text-emerald-300" />
              <p className="text-xs leading-5 text-white/65">
                Use a mix of letters, numbers, and symbols.
              </p>
            </div>

            <div className="flex gap-3">
              <CheckCircle2 size={16} className="mt-0.5 text-emerald-300" />
              <p className="text-xs leading-5 text-white/65">
                Update your password if you notice suspicious activity.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <AlertTriangle size={18} />
            </div>

            <div>
              <p className="text-sm font-extrabold text-slate-950">
                Privacy reminder
              </p>
              <p className="text-xs text-slate-500">Keep credentials private</p>
            </div>
          </div>

          <p className="text-xs leading-5 text-slate-600">
            RevHive will never ask you to share your password in chat, comments,
            email replies, or public posts.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Eye size={18} />
            </div>

            <div>
              <p className="text-sm font-extrabold text-slate-950">
                Session status
              </p>
              <p className="text-xs text-slate-500">Current device active</p>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-600">
            Your account is currently signed in securely.
          </div>
        </div>
      </aside>

      <style>{`
        .security-field {
          display: grid;
          grid-template-columns: 44px minmax(0, 1fr);
          gap: 12px;
          align-items: start;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          border-radius: 16px;
          padding: 14px;
        }

        .security-icon {
          display: flex;
          height: 44px;
          width: 44px;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
        }
      `}</style>
    </div>
  );
}
