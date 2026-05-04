import { Key, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Reset link sent!");
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
          <h2 className="text-2xl font-semibold">Forgot password?</h2>
          <p className="text-gray-500 text-sm mt-1">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

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
