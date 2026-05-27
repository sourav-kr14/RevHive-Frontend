import { useState } from "react";
import { Eye, EyeOff, MessageCircle, Heart, Users } from "lucide-react";
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
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userNameOrEmail: formData.email,
          password: formData.password,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        toast.error("Invalid credentials");
        return;
      }

      const data = responseData.data;

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
          <section className="relative hidden overflow-hidden xl:flex xl:items-center xl:justify-center">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />

            <div className="relative z-10 max-w-lg px-10">
              <div className="mb-8 flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="h-14 w-14 rounded-2xl bg-white p-1 object-contain shadow-sm"
                />

                <div>
                  <p className="bg-gradient-to-r from-orange-400 via-rose-500 to-pink-500 bg-clip-text text-2xl font-bold text-transparent">
                    RevHive
                  </p>

                  <p className="text-sm text-slate-500">
                    Connect. Create. Belong.
                  </p>
                </div>
              </div>
              <h1 className="bg-gradient-to-r from-[#ff7b00] via-[#ff3d81] to-[#7c4dff] bg-clip-text text-6xl font-semibold leading-[1.05] tracking-tight text-transparent">
                Stay connected with your people.
              </h1>

              {/* <p className="mt-5 max-w-md text-base leading-7 text-slate-600">
                Continue sharing moments, chatting with friends, and exploring
                your community.
              </p> */}

              <div className="mt-10 rounded-[2rem] border border-white/70 bg-white/50 p-6 shadow-[0_24px_80px_rgba(79,70,229,0.15)] backdrop-blur-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-2xl bg-white/70 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fuchsia-100 text-fuchsia-600">
                      <Heart size={20} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Share your moments
                      </p>

                      <p className="text-xs text-slate-500">
                        Post updates, photos and stories
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl bg-white/70 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
                      <MessageCircle size={20} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Chat instantly
                      </p>

                      <p className="text-xs text-slate-500">
                        Stay close with real-time messaging
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl bg-white/70 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                      <Users size={20} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Build your community
                      </p>

                      <p className="text-xs text-slate-500">
                        Discover and connect with others
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
                {/* <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-semibold text-fuchsia-700">
                  Welcome back
                </div> */}

                <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                  Log in to your circle
                </h2>

                {/* <p className="mt-1 text-sm text-slate-500">
                  Continue exploring posts, messages, and people you follow.
                </p> */}
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
