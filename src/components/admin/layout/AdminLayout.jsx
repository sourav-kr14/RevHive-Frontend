import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-6xl px-6 py-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
