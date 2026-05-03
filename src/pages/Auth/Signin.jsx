import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Rocket,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./authService";

export default function Signin() {
  const [userNameOrEmail, setUserNameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
            id: data.id || "",
            username: data.username || "",
            email: data.email || "",
          }),
        );

        if (data.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      } else {
        setError("Login failed");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Invalid credentials. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#0a0a0f] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Animated nebula background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139,92,246,0.15), transparent 50%)`,
        }}
      ></div>

      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-float-delayed"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl"></div>

      {/* Stars */}
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            width: Math.random() * 2 + 1 + "px",
            height: Math.random() * 2 + 1 + "px",
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
            animationDelay: Math.random() * 5 + "s",
            opacity: Math.random() * 0.5 + 0.2,
          }}
        />
      ))}

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-12 items-center z-10">
        {/* LEFT SIDE */}
        <div className="relative">
          <div className="absolute -top-32 -left-32 w-72 h-72 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-orbit"></div>

          <div className="relative space-y-8">
            {/* Logo */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 blur-2xl opacity-50"></div>
              <div className="relative flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  RevHive
                </span>
              </div>
            </div>

            {/* Simple text */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-purple-300">
                <Sparkles size={12} />
                <span>good to see you</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-white">Your people.</span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Your space.
                </span>
                <br />
                <span className="text-white/80">Your vibe.</span>
              </h1>
              <p className="text-gray-400 text-base max-w-sm leading-relaxed">
                Not just another platform. This is where your ideas come alive.
              </p>
            </div>

            {/* Simple features */}
            <div className="space-y-3 pt-4">
              {[
                {
                  icon: <Zap size={16} />,
                  text: "Real-time",
                  color: "text-yellow-400",
                },
                {
                  icon: <Sparkles size={16} />,
                  text: "Smooth UX",
                  color: "text-purple-400",
                },
                {
                  icon: <Rocket size={16} />,
                  text: "Secure",
                  color: "text-blue-400",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 group cursor-default"
                >
                  <div
                    className={`${feature.color} bg-white/5 p-1.5 rounded-lg group-hover:scale-110 transition-transform`}
                  >
                    {feature.icon}
                  </div>
                  <span className="text-gray-300 text-sm">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Simple message */}
            <div className="flex items-center gap-4 pt-2">
              <div className="text-3xl">👋</div>
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300">
                You're back. Let's build 🚀
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(139,92,246,0.1), rgba(59,130,246,0.1), transparent)",
              }}
            ></div>

            <div className="relative">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-block p-3 rounded-2xl bg-white/5 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Sign in</h2>
                <p className="text-gray-400 text-sm">
                  Welcome back. Enter your details.
                </p>
              </div>

              <form onSubmit={handleSignin} className="space-y-5">
                {error && (
                  <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-center animate-shake">
                    {error}
                  </div>
                )}

                {/* Email/Username Field */}
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors duration-200 z-10" />
                  <input
                    type="text"
                    placeholder="email or username"
                    value={userNameOrEmail}
                    onChange={(e) => setUserNameOrEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-gray-500/60 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                  <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-purple-500/0 to-transparent group-focus-within:via-purple-500/50 transition-all duration-500"></div>
                </div>

                {/* Password Field */}
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors duration-200 z-10" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-12 text-white placeholder:text-gray-500/60 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-purple-500/0 to-transparent group-focus-within:via-purple-500/50 transition-all duration-500"></div>
                </div>

                {/* Forgot password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-gray-500 hover:text-blue-600"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full group/btn overflow-hidden rounded-xl font-bold transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-90 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                  <div className="relative z-10 flex items-center justify-center gap-2 py-3.5 text-white">
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>wait...</span>
                      </>
                    ) : (
                      <>
                        <span>Login</span>
                        <ArrowRight
                          size={16}
                          className="group-hover/btn:translate-x-1 transition-transform duration-200"
                        />
                      </>
                    )}
                  </div>
                </button>

                {/* Sign up link */}
                <div className="relative pt-4 text-center">
                  <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  <p className="text-sm text-gray-500 pt-4">
                    New here?{" "}
                    <span
                      className="text-purple-400 font-medium cursor-pointer hover:text-purple-300 transition-colors duration-200 inline-flex items-center gap-1 group/link"
                      onClick={() => navigate("/signup")}
                    >
                      Create account
                      <ArrowRight
                        size={12}
                        className="group-hover/link:translate-x-0.5 transition-transform duration-200"
                      />
                    </span>
                  </p>
                </div>

                {/* Demo hint */}
                <div className="text-center pt-2">
                  <p className="text-[11px] text-gray-600/50">
                    demo: demo@revhive.com / anything
                  </p>
                </div>
              </form>
            </div>
          </div>

          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-xl"></div>
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-xl"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(15px) translateX(-10px);
          }
        }
        @keyframes orbit {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          50% {
            transform: translate(20px, -20px) scale(1.05);
          }
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.8;
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }
        .animate-orbit {
          animation: orbit 12s ease-in-out infinite;
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}
