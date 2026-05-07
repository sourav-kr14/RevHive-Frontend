import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
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
      const data = await res.json();

      if (!res.ok) {
        toast.error("Invalid credentials");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      toast.success("Login successful");
      if (data.user) {
  localStorage.setItem("user", JSON.stringify(data.user));
} else {
  localStorage.setItem("user", JSON.stringify(data));
}
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 md:p-8">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="logo" className="w-20 h-20" />
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-gray-500">
            Enter your credentials to continue
          </p>
        </div>

        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => navigate("/Signup")}
            className="w-1/2 py-2 text-sm text-gray-500"
          >
            Sign up
          </button>
          <button className="w-1/2 bg-white py-2 rounded-md shadow text-sm">
            Log in
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            onChange={handleChange}
            className="input"
          />

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
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

          {/* Forgot password */}
          <div className="text-right text-sm">
            <Link
              to="/forgot-password"
              className="text-purple-600 cursor-pointer"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700">
            Log in
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
            Sign in with Google
          </button>
        </form>

        {/* Bottom */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/Signup")}
            className="text-purple-600 cursor-pointer"
          >
            Sign up
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
        }
        .input:focus {
          border-color: #a855f7;
          box-shadow: 0 0 0 2px rgba(168,85,247,0.2);
        }
      `}</style>
    </div>
  );
};

export default Signin;
