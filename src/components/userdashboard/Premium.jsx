import { useState } from "react";
import api from "../../services/api";
import { toast } from "sonner";

export default function Premium() {
  const [loading, setLoading] = useState(false);

  const upgrade = async () => {
    try {
      setLoading(true);

      // baseURL already has /api
      const res = await api.post("/premium/upgrade");

      // save new premium token
      localStorage.setItem("token", res.data);

      toast.success("Congratulations! You are now Premium ⭐");

      // reload app with new token + premium state
      window.location.href = "/user/dashboard";
    } catch (e) {
      console.log(e);
      toast.error("Upgrade failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] text-white px-4">
      <div
        className="w-full max-w-md bg-white/5 backdrop-blur-xl
        border border-white/10 p-8 rounded-2xl
        shadow-[0_0_30px_rgba(139,92,246,0.2)] text-center"
      >
        <h2 className="text-3xl font-bold mb-3">Upgrade to Premium 🚀</h2>

        <p className="text-sm text-gray-400 mb-8">
          Unlock AI captions, hashtags, summaries, premium tools and more.
        </p>

        <button
          onClick={upgrade}
          disabled={loading}
          className="w-full px-6 py-3 rounded-xl text-sm font-semibold
          bg-gradient-to-r from-purple-500 to-blue-500
          hover:scale-[1.02] transition-all duration-200
          disabled:opacity-50"
        >
          {loading ? "Processing..." : "Upgrade Now"}
        </button>
      </div>
    </div>
  );
}
