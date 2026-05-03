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
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.userName,
          email: formData.email,
          password: formData.password,
          bio: formData.bio,
          dob: formData.dob,
        }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-12 items-center">
        {/* FORM */}
        <div className="w-full lg:w-[650px] bg-white border border-gray-200 rounded-3xl p-8 shadow-lg">
          <div className="mb-6 space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">RevHive</h1>
            <h2 className="text-xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={handleLoginRedirect}
                className="text-blue-600 underline"
              >
                Sign in
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username + Email */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs text-gray-500">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    name="userName"
                    onChange={handleChange}
                    required
                    placeholder="johndoe"
                    className="w-full pl-10 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    onChange={handleChange}
                    required
                    placeholder="email@example.com"
                    className="w-full pl-10 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Passwords */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs text-gray-500">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Avatar + DOB */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs text-gray-500">Avatar URL</label>
                <div className="relative">
                  <Link className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    name="avatarUrl"
                    onChange={handleChange}
                    className="w-full pl-10 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500">DOB</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    name="dob"
                    type="date"
                    onChange={handleChange}
                    required
                    className="w-full pl-10 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="text-xs text-gray-500">Bio</label>
              <textarea
                name="bio"
                rows="2"
                onChange={handleChange}
                className="w-full py-3 px-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 text-sm text-gray-600">
              <label className="flex gap-2 items-start">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  onChange={handleChange}
                  className="mt-1"
                />
                I agree to Terms & Privacy Policy
              </label>

              <label className="flex gap-2">
                <input
                  type="checkbox"
                  name="subscribeNewsletter"
                  onChange={handleChange}
                />
                Send updates
              </label>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2"
            >
              Create Account
              <ChevronRight size={18} />
            </button>
          </form>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex flex-col items-center text-center max-w-sm">
          <img
            src="/Signup_Illustration.png"
            alt="Illustration"
            className="rounded-xl mb-6"
          />
          <h3 className="text-3xl font-bold text-gray-900">
            Join the Community
          </h3>
          <p className="text-gray-600">
            Build, collaborate, and grow with modern tools.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
