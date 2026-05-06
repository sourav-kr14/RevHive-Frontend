import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="flex min-h-screen
      bg-gradient-to-b from-[#0b0f1a] to-[#070a12] text-white"
    >
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:relative z-50 md:z-auto
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <Sidebar />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-4 border-b border-white/10">
          <button onClick={() => setOpen(true)}>
            <Menu size={24} />
          </button>

          <h1 className="ml-4 text-lg font-semibold">Admin Panel</h1>
        </div>

        {/* Content */}
        <div className="flex justify-center w-full">
          <div className="w-full max-w-6xl px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-6">
            <div
              className="bg-white/5 backdrop-blur-xl border border-white/10
              rounded-2xl p-3 sm:p-5
              shadow-[0_0_20px_rgba(139,92,246,0.08)]"
            >
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
