import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function InputField({ label, type = "text", ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-2 w-full">
      <label className="text-sm font-medium text-black">{label}</label>

      <div className="relative w-full">
        <input
          type={inputType}
          {...props}
          className="
          w-full
          border
          border-gray-300
          bg-white
          text-black
          rounded-xl
          pl-4
          pr-12
          py-3
          outline-none
          focus:ring-2
          focus:ring-purple-500
          placeholder:text-gray-400
          "
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
}

