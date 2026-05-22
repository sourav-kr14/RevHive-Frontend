import { useState } from "react";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  MessageCircle,
  ImagePlus,
  Users,
  TrendingUp,
  Heart,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Signup = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
    avatarUrl: "",
    dob: "",
    agreeTerms: false,
    subscribeNewsletter: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (formData.userName.trim().length < 3) {
      newErrors.userName = "Username must be at least 3 characters";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (
      !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)
    ) {
      newErrors.password =
        "Include uppercase, lowercase, number & special character";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "Please accept terms and conditions";
    }

    if (formData.dob) {
      const today = new Date();
      const birthDate = new Date(formData.dob);

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 18) {
        newErrors.dob = "You must be at least 18 years old";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await fetch("http://localhost:8081/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.userName,
          email: formData.email,
          password: formData.password,
          bio: formData.bio,
          dob: formData.dob,
        }),
      });

      if (!res.ok) {
        toast.error("Signup failed");
        return;
      }

      toast.success("Account created successfully");

      setTimeout(() => {
        navigate("/signin");
      }, 1200);
    } catch {
      toast.error("Server not responding");
    }
  };

  const previewName = formData.userName.trim() || "Your username";
  const previewBio =
    formData.bio.trim() ||
    "Share moments, build your circle, and discover what people are talking about.";

  return (
    <div className="h-screen w-full overflow-hidden bg-[#eef4ff] text-slate-950">
      <div className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8fbff_0%,#eef4ff_36%,#fff1f8_100%)]" />
        <div className="absolute left-[-10%] top-[-15%] h-[520px] w-[520px] rounded-full bg-cyan-300/35 blur-[90px]" />
        <div className="absolute bottom-[-18%] right-[-10%] h-[620px] w-[620px] rounded-full bg-fuchsia-300/35 blur-[100px]" />
        <div className="absolute left-[38%] top-[22%] h-[340px] w-[340px] rounded-full bg-indigo-300/25 blur-[90px]" />

        <div className="relative z-10 grid h-screen w-full xl:grid-cols-[1.1fr_0.9fr]">
          <section className="relative hidden overflow-hidden px-8 py-5 xl:flex xl:flex-col xl:justify-between">
            <div className="absolute inset-0 bg-white/25 backdrop-blur-[2px]" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="h-18 w-18 rounded-2xl"
                />
                <div>
                  <p className="bg-gradient-to-r from-orange-400 via-rose-500 to-pink-500 bg-clip-text text-lg font-bold text-transparent">
                    RevHive
                  </p>
                  <p className="text-xs text-slate-500">
                    Connect. Create. Belong.
                  </p>
                </div>
              </div>

              <div className="rounded-full border border-white/70 bg-white/60 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur">
                2M+ creators joined
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-[0.9fr_1.1fr] gap-8">
              <div className="flex flex-col justify-center">
                <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-sm font-semibold text-fuchsia-700 shadow-sm backdrop-blur">
                  Your next digital circle starts here
                </div>

                <h1 className="max-w-xl text-5xl font-semibold leading-[1.02] tracking-tight text-slate-950">
                  Meet people who match your energy.
                </h1>

                <p className="mt-3 max-w-lg text-base leading-7 text-slate-600">
                  Share posts, follow creators, start conversations, and turn
                  everyday moments into a social feed worth coming back to.
                </p>

                <div className="mt-6 grid max-w-xl grid-cols-3 gap-5">
                  <div className="rounded-2xl border border-white/70 bg-white/55 p-4 shadow-sm backdrop-blur">
                    <Users size={20} className="mb-3 text-fuchsia-600" />
                    <p className="text-xl font-semibold text-slate-950">48k</p>
                    <p className="text-xs text-slate-500">active circles</p>
                  </div>

                  <div className="rounded-2xl border border-white/70 bg-white/55 p-4 shadow-sm backdrop-blur">
                    <ImagePlus size={20} className="mb-3 text-fuchsia-600" />
                    <p className="text-xl font-semibold text-slate-950">9M</p>
                    <p className="text-xs text-slate-500">posts shared</p>
                  </div>

                  <div className="rounded-2xl border border-white/70 bg-white/55 p-4 shadow-sm backdrop-blur">
                    <TrendingUp size={20} className="mb-3 text-fuchsia-600" />
                    <p className="text-xl font-semibold text-slate-950">Live</p>
                    <p className="text-xs text-slate-500">daily trends</p>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="absolute h-[520px] w-[320px] rotate-[-8deg] rounded-[2.2rem] bg-fuchsia-300/35 blur-3xl" />

                <div className="relative w-[340px] rounded-[2.2rem] border border-white/70 bg-white/45 p-4 shadow-[0_24px_80px_rgba(79,70,229,0.18)] backdrop-blur-xl">
                  <div className="rounded-[1.7rem] bg-slate-950 p-4 text-white">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">Today’s Feed</p>
                        <p className="text-xs text-white/45">For you</p>
                      </div>

                      <div className="flex -space-x-2">
                        <div className="h-8 w-8 rounded-full border-2 border-slate-950 bg-fuchsia-400" />
                        <div className="h-8 w-8 rounded-full border-2 border-slate-950 bg-cyan-300" />
                        <div className="h-8 w-8 rounded-full border-2 border-slate-950 bg-amber-300" />
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white p-3 text-slate-950">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            formData.avatarUrl ||
                            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop"
                          }
                          alt=""
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-bold">{previewName}</p>
                          <p className="text-xs text-slate-500">just now</p>
                        </div>
                      </div>

                      <p className="mt-3 text-sm leading-5 text-slate-700">
                        {previewBio}
                      </p>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="h-28 rounded-2xl bg-gradient-to-br from-fuchsia-400 to-orange-300" />
                        <div className="h-28 rounded-2xl bg-gradient-to-br from-cyan-300 to-indigo-400" />
                      </div>

                      <div className="mt-3 flex items-center justify-between text-slate-500">
                        <div className="flex items-center gap-1">
                          <Heart
                            size={16}
                            className="fill-rose-500 text-rose-500"
                          />
                          <span className="text-xs font-medium">12.8k</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <MessageCircle size={16} />
                          <span className="text-xs font-medium">842</span>
                        </div>

                        <span className="text-xs font-medium">Share</span>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="h-16 rounded-2xl bg-white/10" />
                      <div className="h-16 rounded-2xl bg-white/10" />
                      <div className="h-16 rounded-2xl bg-white/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/55 p-4 shadow-sm backdrop-blur">
                <ShieldCheck size={20} className="text-fuchsia-600" />
                <span className="text-sm font-medium text-slate-600">
                  Private by default
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/55 p-4 shadow-sm backdrop-blur">
                <MessageCircle size={20} className="text-fuchsia-600" />
                <span className="text-sm font-medium text-slate-600">
                  Real-time chats
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/55 p-4 shadow-sm backdrop-blur">
                <CheckCircle2 size={20} className="text-fuchsia-600" />
                <span className="text-sm font-medium text-slate-600">
                  Creator profiles
                </span>
              </div>
            </div>
          </section>

          <main className="flex h-screen items-center justify-center px-4 py-2 sm:px-5 lg:px-6 overflow-hidden">
            <div className="w-full max-w-2xl rounded-[1.4rem] border border-white/70 bg-white/85 p-4 shadow-[0_24px_90px_rgba(79,70,229,0.18)] backdrop-blur-xl sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
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
                      Connect. Create. Belong.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/signin")}
                  className="ml-auto rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Log in
                </button>
              </div>

              <div className="mb-4">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-semibold text-fuchsia-700">
                  Join the community
                </div>

                <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                  Create your profile
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Build your identity and start exploring people, posts, and
                  conversations.
                </p>
              </div>

              <div className="mb-4 grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
                <button
                  type="button"
                  className="rounded-xl bg-white py-2.5 text-sm font-bold text-slate-950 shadow-sm"
                >
                  Sign up
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/signin")}
                  className="rounded-xl py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-950"
                >
                  Log in
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                <div>
                  <label className="label">Username</label>
                  <input
                    name="userName"
                    placeholder="Choose a handle"
                    value={formData.userName}
                    onChange={handleChange}
                    className="input"
                  />
                  {errors.userName && (
                    <p className="error">{errors.userName}</p>
                  )}
                </div>

                <div>
                  <label className="label">Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                  />
                  {errors.email && <p className="error">{errors.email}</p>}
                </div>

                <div>
                  <label className="label">Password</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
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
                  {errors.password && (
                    <p className="error">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="label">Confirm password</label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Repeat password"
                      value={formData.confirmPassword}
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
                  {errors.confirmPassword && (
                    <p className="error">{errors.confirmPassword}</p>
                  )}
                </div>

                <div>
                  <label className="label">Date of birth</label>
                  <input
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    className="input"
                  />
                  {errors.dob && <p className="error">{errors.dob}</p>}
                </div>

                <div>
                  <label className="label">Profile photo URL</label>
                  <input
                    name="avatarUrl"
                    placeholder="Paste image link"
                    value={formData.avatarUrl}
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="label">Bio</label>
                  <textarea
                    name="bio"
                    placeholder="What should people know about you?"
                    rows="2"
                    value={formData.bio}
                    onChange={handleChange}
                    className="input h-16 resize-none py-2"
                  />
                </div>

                <div className="sm:col-span-2 grid gap-2 pt-1 text-sm text-slate-600">
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="mt-1 accent-fuchsia-600"
                    />
                    <span>I agree to the terms and community guidelines</span>
                  </label>

                  {errors.agreeTerms && (
                    <p className="error">{errors.agreeTerms}</p>
                  )}

                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      name="subscribeNewsletter"
                      checked={formData.subscribeNewsletter}
                      onChange={handleChange}
                      className="mt-1 accent-fuchsia-600"
                    />
                    <span>Send me product updates and trending highlights</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="sm:col-span-2 rounded-xl bg-blue-500 py-2.5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-600 hover:cursor-pointer"
                >
                  Create account
                </button>

                <button
                  type="button"
                  className="sm:col-span-2 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    className="h-4 w-4"
                    alt=""
                  />
                  Continue with Google
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>

      <style>{`
        .label {
          display: block;
          margin-bottom: 4px;
          color: #334155;
          font-size: 13px;
          font-weight: 700;
        }

        .input {
          width: 100%;
          height: 40px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #ffffff;
          padding: 0 14px;
          color: #0f172a;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        textarea.input {
          line-height: 1.45;
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

        .error {
          margin-top: 6px;
          color: #ef4444;
          font-size: 12px;
          line-height: 1.25;
        }
      `}</style>
    </div>
  );
};

export default Signup;
