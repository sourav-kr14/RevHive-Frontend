import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    alert("Password updated!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-6">
          <div className="mb-4 text-3xl">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900">Set new password</h2>
          <p className="text-gray-500 text-sm">
            Must be different from previous password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
            <input
              type={show ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Confirm */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
            <input
              type={show ? "text" : "password"}
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full pl-10 py-3 bg-gray-50 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Rules */}
          <div className="text-sm text-gray-600 space-y-1">
            <p>• At least 8 characters</p>
            <p>• One special character</p>
          </div>

          <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
            Reset password
          </button>

          <button
            type="button"
            onClick={() => navigate("/signin")}
            className="flex items-center justify-center gap-2 text-sm text-gray-600 w-full"
          >
            <ArrowLeft size={16} /> Back to login
          </button>
        </form>
      </div>
    </div>
  );
}
