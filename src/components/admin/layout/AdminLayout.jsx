import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  return (
    <div
      className="flex min-h-screen 
    bg-gradient-to-b from-[#0b0f1a] to-[#070a12] text-white"
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-6xl px-6 py-6 flex flex-col gap-6">
          {/* Content */}
          <div
            className="bg-white/5 backdrop-blur-xl border border-white/10 
          rounded-2xl p-5 shadow-[0_0_20px_rgba(139,92,246,0.08)]"
          >
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
