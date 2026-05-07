import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
      const res = await fetch("http://localhost:8080/api/auth/register", {
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
            onClick={() => navigate("/signin")}
            className="w-1/2 py-2 text-sm text-gray-500"
          >
            Log in
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Username */}
          <div>
            <input
              name="userName"
              placeholder="Enter your name"
              value={formData.userName}
              onChange={handleChange}
              className="input"
            />

            {errors.userName && <p className="error">{errors.userName}</p>}
          </div>

          {/* Email */}
          <div>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="input"
            />

            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="input"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          {/* Confirm Password */}
          <div className="relative">
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input w-full"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {errors.confirmPassword && (
              <p className="error">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Avatar */}
          <div>
            <input
              name="avatarUrl"
              placeholder="Avatar URL"
              value={formData.avatarUrl}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* DOB */}
          <div>
            <input
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              className="input"
            />
            {errors.dob && <p className="error">{errors.dob}</p>}
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <textarea
              name="bio"
              placeholder="Bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Checkboxes */}
          <div className="md:col-span-2 text-sm text-gray-600 space-y-2">
            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              Agree to Terms
            </label>

            {errors.agreeTerms && <p className="error">{errors.agreeTerms}</p>}

            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                name="subscribeNewsletter"
                checked={formData.subscribeNewsletter}
                onChange={handleChange}
              />
              Send updates
            </label>
          </div>

          {/* Submit */}
          <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition md:col-span-2">
            Get started
          </button>

          {/* Google */}
          <button
            type="button"
            className="w-full border py-3 rounded-lg flex justify-center gap-2 md:col-span-2 hover:bg-gray-50"
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
            onClick={() => navigate("/signin")}
            className="text-purple-600 cursor-pointer"
          >
            Log in
          </span>
        </p>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          outline: none;
          color: black;
          background: white;
        }

        .input:focus {
          border-color: #a855f7;
          box-shadow: 0 0 0 2px rgba(168,85,247,0.2);
        }

        .error {
          color: #ef4444;
          font-size: 13px;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
};

export default Signup;
