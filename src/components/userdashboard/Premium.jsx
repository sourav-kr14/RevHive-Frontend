import { useState } from "react";
import { Crown, Wand2, Hash, FileText, ShieldCheck } from "lucide-react";
import api from "../../services/api";
import { toast } from "sonner";

export default function Premium() {
  const [loading, setLoading] = useState(false);

  const upgrade = async () => {
    try {
      setLoading(true);

      const res = await api.post("/premium/upgrade");

      localStorage.setItem("token", res.data.data);

      toast.success("Premium activated successfully");

      window.location.href = "/user/dashboard";
    } catch (err) {
      console.error(err);
      toast.error("Activation failed");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Wand2,
      title: "AI Caption Generator",
    },
    {
      icon: Hash,
      title: "Smart Hashtag Suggestions",
    },
    {
      icon: FileText,
      title: "Content Summaries",
    },
    {
      icon: ShieldCheck,
      title: "AI Safety Check",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div
        className="
        w-full
        max-w-lg
        rounded-3xl
        border
        border-slate-200
        bg-white/80
        backdrop-blur-xl
        shadow-xl
        p-8
      "
      >
        <div className="flex justify-center">
          <div
            className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-gradient-to-r
            from-fuchsia-500
            to-violet-500
            text-white
          "
          >
            <Crown size={28} />
          </div>
        </div>

        <h1 className="mt-5 text-center text-3xl font-black text-slate-900">
          RevHive Premium
        </h1>

        <p className="mt-2 text-center text-sm text-slate-500">
          Unlock advanced AI-powered creator tools.
        </p>

        <div className="mt-8 space-y-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="
                flex
                items-center
                gap-4
                rounded-2xl
                bg-slate-50
                p-4
              "
              >
                <div
                  className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-fuchsia-100
                  text-fuchsia-600
                "
                >
                  <Icon size={18} />
                </div>

                <span className="font-semibold text-slate-700">
                  {feature.title}
                </span>
              </div>
            );
          })}
        </div>

        <button
          onClick={upgrade}
          disabled={loading}
          className="
          mt-8
          w-full
          rounded-2xl
          bg-gradient-to-r
          from-fuchsia-500
          to-violet-500
          py-3
          font-bold
          text-white
          transition
          hover:opacity-90
          disabled:opacity-50
        "
        >
          {loading ? "Activating..." : "Activate Premium"}
        </button>
      </div>
    </div>
  );
}
