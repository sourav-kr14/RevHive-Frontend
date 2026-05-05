import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function Password() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/auth/change-password",
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      toast.success("Password updated");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      alert(JSON.stringify(err.response?.data));
    }
  };

  return (
    <div className="space-y-5 max-w-md">
      <div>
        <label className="text-sm text-gray-400">Old Password</label>
        <input
          type="password"
          placeholder="Enter old password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg p-2 text-white placeholder:text-gray-500 outline-none focus:border-purple-500"
        />
      </div>

      <div>
        <label className="text-sm text-gray-400">New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg p-2 text-white placeholder:text-gray-500 outline-none focus:border-purple-500"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium hover:opacity-90"
      >
        Update Password
      </button>
    </div>
  );
}
