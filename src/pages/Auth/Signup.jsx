import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  FileText,
  Link,
  Calendar,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const navigate = useNavigate();
  const handleLoginRedirect = (e) => {
    e.preventDefault();
    navigate("/Signin");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!formData.agreeTerms) {
      alert("You must agree to the Terms and Conditions.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
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

      let data = null;

      const text = await response.text();
      if (text) {
        data = JSON.parse(text);
      }

      if (!response.ok) {
        alert(data?.message || "Registration failed");
        return;
      }

      alert("Registration successful!");
      navigate("/Signin");
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-[#030712]">
      {/* --- PREMIUM BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] animate-pulse"></div>
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        {/* Noise & Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl w-full h-full flex flex-col lg:flex-row items-center justify-center gap-16 overflow-hidden">
        {/* --- REGISTRATION FORM CARD --- */}
        <div className="group relative w-full lg:w-[680px]">
          {/* Outer Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>

          <div className="relative bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
            {/* Top accent line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

            <div className="mb-6 space-y-3">
              {/* Brand */}
              <h1 className="text-3xl font-semibold text-white tracking-tight">
                RevHive
              </h1>

              {/* Title */}
              <h2 className="text-2xl font-bold text-white">
                Create your account
              </h2>

              {/* Subtitle */}
              <p className="text-gray-400 text-sm leading-relaxed">
                Already part of the community?{" "}
                <button
                  type="button"
                  onClick={handleLoginRedirect}
                  className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4 decoration-blue-500/40 transition"
                >
                  Sign in here
                </button>
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="space-y-5 max-h-[65vh] pr-2 overflow-y-auto custom-scrollbar"
            >
              {/* Row 1: Username & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] ml-1">
                    User Name
                  </label>
                  <div className="relative group/input">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within/input:text-blue-500 transition-colors" />
                    <input
                      name="userName"
                      type="text"
                      placeholder="johndoe"
                      onChange={handleChange}
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-700 focus:bg-white/[0.07] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] ml-1">
                    Email Address
                  </label>
                  <div className="relative group/input">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within/input:text-blue-500 transition-colors" />
                    <input
                      name="email"
                      type="email"
                      placeholder="name@company.com"
                      onChange={handleChange}
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-700 focus:bg-white/[0.07] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Passwords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] ml-1">
                    Password
                  </label>
                  <div className="relative group/input">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within/input:text-blue-500 transition-colors" />
                    <input
                      name="password"
                      type={setShowPassword ? "text" : "password"}
                      placeholder="Enter password"
                      onChange={handleChange}
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-700 focus:bg-white/[0.07] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] ml-1">
                    Confirm Password
                  </label>
                  <div className="relative group/input">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within/input:text-blue-500 transition-colors" />
                    <input
                      name="confirmPassword"
                      type={setShowPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      onChange={handleChange}
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-700 focus:bg-white/[0.07] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 3: Avatar & DOB */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] ml-1">
                    Avatar URL
                  </label>
                  <div className="relative group/input">
                    <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within/input:text-blue-500 transition-colors" />
                    <input
                      name="avatarUrl"
                      type="url"
                      placeholder="https://..."
                      onChange={handleChange}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-700 focus:bg-white/[0.07] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] ml-1">
                    Date of Birth
                  </label>
                  <div className="relative group/input">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within/input:text-blue-500 transition-colors" />
                    <input
                      name="dob"
                      type="date"
                      onChange={handleChange}
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:bg-white/[0.07] focus:border-blue-500/50 outline-none transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Bio */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] ml-1">
                  Tell us about yourself
                </label>
                <div className="relative group/input">
                  <FileText className="absolute left-4 top-4 w-4 h-4 text-gray-600 group-focus-within/input:text-blue-500 transition-colors" />
                  <textarea
                    name="bio"
                    rows="2"
                    placeholder="Brief bio..."
                    onChange={handleChange}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-700 focus:bg-white/[0.07] focus:border-blue-500/50 outline-none transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="space-y-4 py-4">
                <label className="flex items-start gap-4 cursor-pointer group/check">
                  <div className="relative flex items-center mt-0.5">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-white/10 bg-white/5 transition-all checked:bg-blue-600 checked:border-blue-600 focus:outline-none"
                    />
                    <div className="absolute text-white opacity-0 peer-checked:opacity-100 left-1 transition-opacity pointer-events-none text-[10px]">
                      ✓
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 leading-relaxed group-hover/check:text-gray-400 transition-colors">
                    I agree to the
                    <a href="#" className="text-blue-400 hover:underline mx-1">
                      Terms of Service
                    </a>
                    and
                    <a href="#" className="text-blue-400 hover:underline ml-1">
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>

                <label className="flex items-center gap-4 cursor-pointer group/check">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      name="subscribeNewsletter"
                      checked={formData.subscribeNewsletter}
                      onChange={handleChange}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-white/10 bg-white/5 transition-all checked:bg-blue-600 checked:border-blue-600 focus:outline-none"
                    />
                    <div className="absolute text-white opacity-0 peer-checked:opacity-100 left-1 transition-opacity pointer-events-none text-[10px]">
                      ✓
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 group-hover/check:text-gray-400 transition-colors">
                    Send me monthly product updates and resources.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black font-bold py-4 rounded-xl shadow-[0_20px_40px_-15px_rgba(255,255,255,0.1)] hover:bg-gray-100 transition-all flex items-center justify-center gap-2 group/btn active:scale-[0.98]"
              >
                Create Account
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>

        {/* --- BRANDING COLUMN --- */}
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center animate-float relative text-center">
          <div className="absolute w-[400px] h-[400px] rounded-full bg-blue-500 opacity-5 blur-[120px] pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center gap-8">
            <div className="p-4 rounded-[2.5rem] bg-white/[0.03] border border-white/10 shadow-2xl backdrop-blur-md">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1 rounded-[2rem]">
                <img
                  src="/Signup_Illustration.png"
                  alt="Illustration"
                  className="w-full h-full object-contain rounded-[1.8rem] bg-[#030712]"
                />
              </div>
            </div>
            <div className="space-y-4 max-w-sm">
              <h3 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tight">
                Join the <br /> Community
              </h3>
              <p className="text-gray-500 leading-relaxed font-light">
                Secure your spot in the next generation of collaborative
                workspaces. Built for scale, designed for you.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } } 
          .animate-float { animation: float 6s ease-in-out infinite; }
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
          `,
        }}
      />
    </div>
  );
};

export default Signup;
