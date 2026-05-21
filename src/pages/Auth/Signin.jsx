import { useState } from "react";
import {
  Eye,
  EyeOff,
  Bell,
  MessageCircle,
  TrendingUp,
  Heart,
  Users,
  ImagePlus,
  Flame,
  AtSign,
  ShieldCheck,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userNameOrEmail: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error("Invalid credentials");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user", JSON.stringify(data));

      toast.success("Login successful");

      if (data.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch {
      toast.error("Error");
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#eef4ff] text-slate-950">
      <div className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8fbff_0%,#eef4ff_36%,#fff1f8_100%)]" />
        <div className="absolute left-[-10%] top-[-15%] h-[520px] w-[520px] rounded-full bg-cyan-300/35 blur-[90px]" />
        <div className="absolute bottom-[-18%] right-[-10%] h-[620px] w-[620px] rounded-full bg-fuchsia-300/35 blur-[100px]" />
        <div className="absolute left-[38%] top-[22%] h-[340px] w-[340px] rounded-full bg-indigo-300/25 blur-[90px]" />

        <div className="relative z-10 grid min-h-screen w-full xl:grid-cols-[1.05fr_0.95fr]">
          <section className="relative hidden overflow-hidden px-10 py-8 xl:flex xl:flex-col">
            <div className="absolute inset-0 bg-white/25 backdrop-blur-[2px]" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="h-12 w-12 rounded-2xl bg-white p-1 object-contain shadow-sm"
                />
                <div>
                  <p className="text-base font-semibold text-slate-950">
                    Your Social App
                  </p>
                  <p className="text-xs text-slate-500">
                    Your world, still moving
                  </p>
                </div>
              </div>

              <div className="rounded-full border border-white/70 bg-white/60 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur">
                12.4k live now
              </div>
            </div>

            <div className="relative z-10 grid flex-1 grid-cols-[0.85fr_1.15fr] items-center gap-8">
              <div>
                <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-sm font-semibold text-fuchsia-700 shadow-sm backdrop-blur">
                  Pick up where you left off
                </div>

                <h1 className="max-w-xl text-6xl font-semibold leading-[1.02] tracking-tight text-slate-950">
                  Your circle has been active.
                </h1>

                <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
                  New posts, replies, reactions, and messages are waiting for
                  you. Log in and catch the best moments before they move on.
                </p>

                <div className="mt-8 grid max-w-xl grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/70 bg-white/55 p-4 shadow-sm backdrop-blur">
                    <Bell size={20} className="mb-3 text-fuchsia-600" />
                    <p className="text-xl font-semibold text-slate-950">28</p>
                    <p className="text-xs text-slate-500">new notifications</p>
                  </div>

                  <div className="rounded-2xl border border-white/70 bg-white/55 p-4 shadow-sm backdrop-blur">
                    <MessageCircle
                      size={20}
                      className="mb-3 text-fuchsia-600"
                    />
                    <p className="text-xl font-semibold text-slate-950">14</p>
                    <p className="text-xs text-slate-500">unread messages</p>
                  </div>

                  <div className="rounded-2xl border border-white/70 bg-white/55 p-4 shadow-sm backdrop-blur">
                    <TrendingUp size={20} className="mb-3 text-fuchsia-600" />
                    <p className="text-xl font-semibold text-slate-950">7</p>
                    <p className="text-xs text-slate-500">trending topics</p>
                  </div>

                  <div className="rounded-2xl border border-white/70 bg-white/55 p-4 shadow-sm backdrop-blur">
                    <Users size={20} className="mb-3 text-fuchsia-600" />
                    <p className="text-xl font-semibold text-slate-950">93</p>
                    <p className="text-xs text-slate-500">friends online</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-14 top-10 h-[480px] w-[360px] rounded-[2rem] bg-fuchsia-300/35 blur-3xl" />

                <div className="relative mx-auto max-w-md rounded-[2rem] border border-white/70 bg-white/50 p-4 shadow-[0_24px_80px_rgba(79,70,229,0.18)] backdrop-blur-xl">
                  <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-950">
                          Activity waiting
                        </p>
                        <p className="text-xs text-slate-500">
                          Since your last visit
                        </p>
                      </div>

                      <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                        Live
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fuchsia-100 text-fuchsia-600">
                          <Heart size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            8 people reacted to your post
                          </p>
                          <p className="text-xs text-slate-500">
                            Your weekend photo is getting love
                          </p>
                        </div>
                        <span className="text-xs font-medium text-slate-400">
                          2m
                        </span>
                      </div>

                      <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
                          <MessageCircle size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            Aarav sent a message
                          </p>
                          <p className="text-xs text-slate-500">
                            “Are you joining the group live?”
                          </p>
                        </div>
                        <span className="text-xs font-medium text-slate-400">
                          8m
                        </span>
                      </div>

                      <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                          <Flame size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            #CampusTalk is trending
                          </p>
                          <p className="text-xs text-slate-500">
                            24k posts from your network
                          </p>
                        </div>
                        <span className="text-xs font-medium text-slate-400">
                          now
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">Your reach</p>
                          <p className="text-xs text-white/50">Past 24 hours</p>
                        </div>

                        <TrendingUp size={20} className="text-fuchsia-300" />
                      </div>

                      <div className="mt-4 flex items-end gap-2">
                        <div className="h-10 flex-1 rounded-t-lg bg-white/20" />
                        <div className="h-16 flex-1 rounded-t-lg bg-fuchsia-400" />
                        <div className="h-12 flex-1 rounded-t-lg bg-white/20" />
                        <div className="h-20 flex-1 rounded-t-lg bg-cyan-300" />
                        <div className="h-14 flex-1 rounded-t-lg bg-white/20" />
                        <div className="h-24 flex-1 rounded-t-lg bg-fuchsia-300" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-white/70 bg-white/65 p-3 text-center shadow-sm">
                      <AtSign
                        size={18}
                        className="mx-auto mb-2 text-fuchsia-600"
                      />
                      <p className="text-xs font-bold text-slate-800">
                        Mentions
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/70 bg-white/65 p-3 text-center shadow-sm">
                      <ImagePlus
                        size={18}
                        className="mx-auto mb-2 text-fuchsia-600"
                      />
                      <p className="text-xs font-bold text-slate-800">
                        New posts
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/70 bg-white/65 p-3 text-center shadow-sm">
                      <ShieldCheck
                        size={18}
                        className="mx-auto mb-2 text-fuchsia-600"
                      />
                      <p className="text-xs font-bold text-slate-800">
                        Protected
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <main className="flex min-h-screen items-center justify-center px-4 py-5 sm:px-6 lg:px-10">
            <div className="w-full max-w-md rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_90px_rgba(79,70,229,0.18)] backdrop-blur-xl sm:p-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 xl:hidden">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="h-11 w-11 rounded-2xl object-contain"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      Your Social App
                    </p>
                    <p className="text-xs text-slate-500">
                      Your world, still moving
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="ml-auto rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Sign up
                </button>
              </div>

              <div className="mb-5">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-semibold text-fuchsia-700">
                  Welcome back
                </div>

                <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                  Log in to your circle
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Continue exploring posts, messages, and people you follow.
                </p>
              </div>

              <div className="mb-5 grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="rounded-xl py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-950"
                >
                  Sign up
                </button>

                <button
                  type="button"
                  className="rounded-xl bg-white py-2.5 text-sm font-bold text-slate-950 shadow-sm"
                >
                  Log in
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Email or username</label>
                  <input
                    name="email"
                    type="text"
                    placeholder="you@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="label mb-0">Password</label>

                    <Link
                      to="/forgot-password"
                      className="text-sm font-semibold text-fuchsia-700 hover:text-fuchsia-800"
                    >
                      Forgot?
                    </Link>
                  </div>

                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="input pr-11"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-btn"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-400 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-600 hover:cursor-pointer"
                >
                  Log in
                </button>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    className="h-4 w-4"
                    alt=""
                  />
                  Continue with Google
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-slate-500">
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="font-bold text-fuchsia-700 hover:text-fuchsia-800"
                >
                  Sign up
                </button>
              </p>
            </div>
          </main>
        </div>
      </div>

      <style>{`
        .label {
          display: block;
          margin-bottom: 6px;
          color: #334155;
          font-size: 13px;
          font-weight: 700;
        }

        .input {
          width: 100%;
          height: 44px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #ffffff;
          padding: 0 14px;
          color: #0f172a;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .input::placeholder {
          color: #94a3b8;
        }

        .input:focus {
          border-color: #c026d3;
          box-shadow: 0 0 0 4px rgba(192, 38, 211, 0.12);
        }

        .password-btn {
          position: absolute;
          right: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
        }

        .password-btn:hover {
          color: #0f172a;
        }
      `}</style>
    </div>
  );
};

export default Signin;
