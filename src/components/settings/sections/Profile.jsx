import { Upload } from "lucide-react";

export default function ProfileSection() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Personal info</h2>
          <p className="text-sm text-gray-400">
            Update your personal details here
          </p>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm rounded-lg border border-white/10 text-gray-300 hover:bg-white/5">
            Cancel
          </button>
          <button className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md hover:opacity-90">
            Save
          </button>
        </div>
      </div>

      {/* FORM */}
      <div className="space-y-6">
        {/* Name */}
        <div>
          <label className="text-sm text-gray-400">Name</label>
          <div className="flex gap-3 mt-1">
            <input
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white placeholder:text-gray-500 outline-none focus:border-purple-500"
              placeholder="First name"
            />
            <input
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white placeholder:text-gray-500 outline-none focus:border-purple-500"
              placeholder="Last name"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-400">Email</label>
          <input
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm mt-1 text-white placeholder:text-gray-500 outline-none focus:border-purple-500"
            placeholder="Enter email"
          />
        </div>

        {/* Profile Photo */}
        <div>
          <label className="text-sm text-gray-400">Your photo</label>

          <div className="flex items-center gap-4 mt-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-sm font-semibold">
              CH
            </div>

            <div className="flex-1 border border-dashed border-white/10 rounded-lg p-4 text-center text-sm text-gray-400 hover:bg-white/5 cursor-pointer">
              <Upload size={16} className="mx-auto mb-1" />
              Click to upload or drag & drop
            </div>
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="text-sm text-gray-400">Role</label>
          <input
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm mt-1 text-white placeholder:text-gray-500 outline-none focus:border-purple-500"
            placeholder="Product Designer"
          />
        </div>
      </div>
    </div>
  );
}
