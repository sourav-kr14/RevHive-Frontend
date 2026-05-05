import { Key, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || password.length < 8) {
      toast.warning("Password must be at least 8 characters");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `http://localhost:8080/api/auth/reset-password?token=${token}&newPassword=${password}`,
      );

      toast.success("Password updated successfully!");
      navigate("/signin");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid or expired token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl border bg-gray-50">
            <Key className="text-gray-600" size={20} />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Set new password</h2>
          <p className="text-gray-500 text-sm">
            Must be different from previous password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password */}
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-400 outline-none"
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-3"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm */}
          <input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-400 outline-none"
          />

          {/* Rules */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>✓ At least 8 characters</p>
            <p>✓ One special character</p>
          </div>

          {/* Submit */}
          <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700">
            Reset password
          </button>

          {/* Back */}
          <button
            type="button"
            onClick={() => navigate("/signin")}
            className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-black w-full"
          >
            <ArrowLeft size={16} />
            Back to log in
          </button>
        </form>
      </div>
    </div>
  );
}
