import { useState } from "react";

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log(form);
  };

  return (
    <div className="max-w-md space-y-4">
      <input
        name="currentPassword"
        type="password"
        placeholder="Current Password"
        onChange={handleChange}
        className="input"
      />
      <input
        name="newPassword"
        type="password"
        placeholder="New Password"
        onChange={handleChange}
        className="input"
      />
      <input
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        onChange={handleChange}
        className="input"
      />

      <button
        onClick={handleSubmit}
        className="bg-gray-900 text-white px-4 py-2 rounded"
      >
        Update Password
      </button>
    </div>
  );
}
