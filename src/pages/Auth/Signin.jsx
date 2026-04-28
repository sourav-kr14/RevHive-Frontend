import { Mail, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const [userNameOrEmail, setUserNameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userNameOrEmail,
          password,
        }),
      });
      const data = await res.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      if (data.role == "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      console.log("Login failed", err);
    }
  };

  return (
    <div className="h-screen w-full bg-[#030712] flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full animate-pulse [animation-delay:2s]"></div>

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-16 items-center z-10">
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
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Sign in
              </h2>
              <p className="text-gray-500 mt-2">
                Welcome back! Please enter your details.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSignin}>
              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    placeholder="you@domain.com"
                    value={userNameOrEmail}
                    onChange={(e) => setUserNameOrEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-600 focus:bg-white/[0.08] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs text-blue-400 hover:text-blue-300 transition"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-600 focus:bg-white/[0.08] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  />
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

              {/* Main Button */}
              <button
                type="submit"
                className="group/btn relative w-full bg-white text-black py-4 rounded-xl font-bold overflow-hidden transition-all hover:bg-gray-100 active:scale-[0.98]"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </div>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 my-8">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
                  Or Secure Login
                </span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
              </div>

              {/* Google Button */}
              <button
                type="button"
                className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white font-medium flex items-center justify-center gap-3"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="w-5 h-5"
                  alt="G"
                />
                Continue with Google
              </button>

              <p className="text-sm text-gray-500 text-center mt-6">
                New here?{" "}
                <span className="text-white font-semibold cursor-pointer hover:text-blue-400 transition-colors underline underline-offset-4 decoration-white/20">
                  Create an account
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
