import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";
import { toast } from "sonner";
export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");

  const handleVerifyOtp = async () => {
    await api.post("/auth/verify-otp", {
      email,
      otp,
    });

    toast.success("Email verified");
    navigate("/signin");
  };

  const handleResendOtp = async () => {
    await api.post("/auth/resend-otp", {
      email,
    });

    toast.success("OTP sent again");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-50 via-slate-50 to-purple-50 flex">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-20">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <img
              src="/logo.png"
              alt="RevHive"
              className="w-16 h-16 rounded-2xl shadow-md"
            />

            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                RevHive
              </h1>

              <p className="text-slate-500 text-lg">Connect. Create. Belong.</p>
            </div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl font-bold leading-tight"
          >
            Check your
            <span className="block bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              inbox.
            </span>
          </motion.h1>

          <p className="mt-8 text-xl text-slate-500 max-w-xl leading-relaxed">
            We've sent a secure verification code to your email. Verify your
            account and start exploring creators, conversations and communities.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-2xl">
          <div className="bg-white/70 backdrop-blur rounded-3xl p-6 shadow-sm">
            <h3 className="text-3xl font-bold">6</h3>
            <p className="text-slate-500">digit code</p>
          </div>

          <div className="bg-white/70 backdrop-blur rounded-3xl p-6 shadow-sm">
            <h3 className="text-3xl font-bold">5m</h3>
            <p className="text-slate-500">validity</p>
          </div>

          <div className="bg-white/70 backdrop-blur rounded-3xl p-6 shadow-sm">
            <h3 className="text-3xl font-bold">100%</h3>
            <p className="text-slate-500">secure</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center p-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl bg-white/90 backdrop-blur-xl rounded-[36px] shadow-lg p-10"
        >
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <ShieldCheck size={40} className="text-green-600" />
            </div>
          </div>

          <h2 className="text-5xl font-bold text-center mb-3">Verify Email</h2>

          <p className="text-center text-slate-500 mb-8">
            OTP sent successfully to
          </p>

          <div className="bg-slate-50 rounded-2xl p-4 text-center mb-8 border">
            <span className="font-semibold text-slate-800">{email}</span>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">
                Verification Code
              </label>

              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full h-14 px-5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full h-14 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
            >
              Verify Account
            </button>

            <button
              onClick={handleResendOtp}
              className="w-full h-14 rounded-2xl border border-slate-200 hover:bg-slate-50 font-medium transition"
            >
              Resend OTP
            </button>

            <button
              onClick={() => navigate("/signin")}
              className="w-full text-slate-500 hover:text-slate-700"
            >
              Back to Login
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
