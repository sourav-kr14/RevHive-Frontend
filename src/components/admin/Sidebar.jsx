import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-64 bg-gray-900 p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>

      <Link to="/admin/dashboard" className="mb-4 hover:text-blue-400">
        Dashboard
      </Link>

      <Link to="/admin/users" className="mb-4 hover:text-blue-400">
        Users
      </Link>

      {/* 🔥 ADD THIS LINE ONLY */}
      <Link to="/admin/reports" className="mb-4 hover:text-blue-400">
        Reports
      </Link>

      <button onClick={logout} className="mt-auto bg-red-500 px-4 py-2 rounded">
        Logout
      </button>
    </div>
  );
}