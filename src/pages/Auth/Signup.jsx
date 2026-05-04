import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!formData.agreeTerms) {
      alert("Accept terms");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
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

      if (!res.ok) {
        alert("Failed");
        return;
      }

      alert("Success");
      navigate("/Signin");
    } catch {
      alert("Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <img
              src="/logo.png"
              alt="logo"
              className="w-20 h-20 object-contain"
            />
          </div>

          <h1 className="text-2xl font-semibold">Create an account</h1>
        </div>
        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button className="w-1/2 bg-white py-2 rounded-md shadow text-sm">
            Sign up
          </button>
          <button
            onClick={() => navigate("/Signin")}
            className="w-1/2 py-2 text-sm text-gray-500"
          >
            Log in
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="userName"
            placeholder="Enter your name"
            required
            onChange={handleChange}
            className="input"
          />

          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            onChange={handleChange}
            className="input"
          />

          {/* Password */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              required
              onChange={handleChange}
              className="input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <input
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm password"
            required
            onChange={handleChange}
            className="input"
          />

          {/* Extra fields */}
          <input
            name="avatarUrl"
            placeholder="Avatar URL"
            onChange={handleChange}
            className="input"
          />

          <input
            name="dob"
            type="date"
            required
            onChange={handleChange}
            className="input"
          />

          <textarea
            name="bio"
            placeholder="Bio"
            rows="2"
            onChange={handleChange}
            className="input"
          />

          {/* Checkboxes */}
          <div className="text-sm text-gray-600 space-y-2">
            <label className="flex gap-2">
              <input
                type="checkbox"
                name="agreeTerms"
                onChange={handleChange}
              />
              Agree to Terms
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

          {/* Submit */}
          <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700">
            Get started
          </button>

          {/* Google */}
          <button
            type="button"
            className="w-full border py-3 rounded-lg flex justify-center gap-2"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-4"
              alt=""
            />
            Sign up with Google
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/Signin")}
            className="text-purple-600 cursor-pointer"
          >
            Log in
          </span>
        </p>
      </div>

      {/* reusable input style */}
      <style>{`
        .input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          outline: none;
        }
        .input:focus {
          border-color: #a855f7;
          box-shadow: 0 0 0 2px rgba(168,85,247,0.2);
        }
      `}</style>
    </div>
  );
};

export default Signup;
