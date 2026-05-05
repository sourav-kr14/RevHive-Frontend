import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function Premium() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const upgrade = async () => {
    try {
      setLoading(true);

      const res = await api.post("/premium/upgrade");

      localStorage.setItem("token", res.data);

      alert("Congratulations!!! You are a RevHive Premium Member!");

      //   window.location.reload();
      navigate("/user/dashboard");
    } catch (e) {
      alert("Upgrade failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] text-white">
      <div
        className="bg-white/5 backdrop-blur-xl border border-white/10 
      p-8 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.2)] text-center"
      >
        <h2 className="text-2xl font-semibold mb-4">Upgrade to Premium 🚀</h2>

        <p className="text-sm text-gray-400 mb-6">
          Unlock AI captions, hashtags, summaries and more.
        </p>

        <button
          onClick={upgrade}
          disabled={loading}
          className="px-6 py-2 rounded-lg text-sm font-medium 
          bg-gradient-to-r from-purple-500 to-blue-500 
          text-white shadow-lg hover:opacity-90 transition
          disabled:opacity-50"
        >
          {loading ? "Processing..." : "Upgrade Now"}
        </button>
      </div>
    </div>
  );
}
