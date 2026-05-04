import { Mail, ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
        `http://localhost:8080/api/auth/forgot-password?email=${email}`,
      );

      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-md bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-12 flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-6">RevHive</h1>

          <h2 className="text-4xl font-bold leading-tight mb-4">
            Reset your password
          </h2>

          <p className="text-white/80 max-w-md">
            Don’t worry if you forgot your password. We’ll help you get back
            into your account quickly and securely.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} />
            <span className="text-white/80 text-sm">
              Secure password recovery
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} />
            <span className="text-white/80 text-sm">
              Instant email instructions
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 mb-4">
              <Mail className="text-purple-600" size={20} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              Forgot password?
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Enter your email to receive reset instructions
            </p>
          </div>

          {/* SUCCESS STATE */}
          {success ? (
            <div className="text-center space-y-4">
              <p className="text-green-600 font-medium">
                Reset link sent successfully!
              </p>
              <p className="text-sm text-gray-500">
                Please check your email (and spam folder).
              </p>

              <button
                onClick={() => navigate("/signin")}
                className="mt-4 w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"
              >
                Back to login
              </button>
            </div>
          ) : (
            /* FORM */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none"
                />
              </div>

              <button
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Sending...
                  </>
                ) : (
                  "Send reset link"
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/signin")}
                className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-black w-full"
              >
                <ArrowLeft size={16} /> Back to login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
