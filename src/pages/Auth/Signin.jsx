import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signin() {
  const [userNameOrEmail, setUserNameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!userNameOrEmail.trim() || !password.trim()) {
      setError("Please enter email and password");
      setLoading(false);
      return;
    }

    try {
      const data = await loginUser({
        userNameOrEmail,
        password,
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role || "USER");

        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.id || data.userId || "",
            username: data.username || data.name || "",
            email: data.email || "",
            followersCount: data.followersCount || 0,
            followingCount: data.followingCount || 0,
          }),
        );

        if (data.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      } else {
        setError("No token received from server");
      }
    } catch (err) {
      let errorMessage = "Login failed. Please try again.";

      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.status === 401) {
        errorMessage = "Invalid email or password";
      } else if (err?.response?.status === 404) {
        errorMessage = "User not found";
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#030712] flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full animate-pulse will-change-transform"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full animate-pulse [animation-delay:2s] will-change-transform"></div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-16 items-center z-10">
        {/* LEFT SIDE (UNCHANGED) */}
        <div className="hidden md:flex flex-col gap-8 relative">
          <div className="relative w-24 h-24 mb-4">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-2xl rotate-12 opacity-20 blur-sm"></div>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl">
              <div className="w-10 h-10 bg-gradient-to-br from-white to-white/50 rounded-full shadow-inner"></div>
            </div>
          </div>

          <div>
            <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 leading-tight tracking-tight">
              Your people. Your space. Your vibe.
            </h1>
            <p className="text-gray-400 mt-6 text-lg max-w-sm leading-relaxed font-light">
              A social platform designed for meaningful interactions—not just
              scrolling.
            </p>
          </div>

          <div className="flex items-center gap-4 py-2 px-4 w-fit rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-[#030712] bg-gray-600"
                ></div>
              ))}
            </div>
            <span className="text-xs text-gray-400 font-medium">
              Joined by 10k+ users
            </span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full max-w-md mx-auto group">
          <div className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:border-white/20">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Sign in
              </h2>
              <p className="text-gray-500 mt-2">
                Welcome back! Please enter your details.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSignin}>
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">
                  Email Address or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="email or username"
                    value={userNameOrEmail}
                    onChange={(e) => setUserNameOrEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-600 focus:bg-white/[0.08] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Password (FIXED) */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="relative w-full">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-10 text-white placeholder:text-gray-700 focus:bg-white/[0.07] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <button
                    type="button"
                    className="text-xs text-blue-400 hover:text-blue-300 transition ml-2"
                  >
                    Forgot?
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-3 cursor-pointer group/check w-fit">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="peer appearance-none w-5 h-5 border border-white/10 rounded bg-white/5 checked:bg-blue-600 checked:border-blue-600 transition-all"
                  />
                  <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none text-[10px]">
                    ✓
                  </div>
                </div>
                <span className="text-sm text-gray-400 group-hover/check:text-gray-300 transition">
                  Stay signed in
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group/btn relative w-full bg-white text-black py-4 rounded-xl font-bold overflow-hidden transition-all hover:bg-gray-100 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{loading ? "Signing in..." : "Login"}</span>
                  {!loading && (
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  )}
                </div>
              </button>

              {/* Signup */}
              <p className="text-sm text-gray-500 text-center mt-6">
                New here?{" "}
                <Link
                  to="/signup"
                  className="text-white font-semibold hover:text-blue-400 underline underline-offset-4 decoration-white/20"
                >
                  Create an account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
