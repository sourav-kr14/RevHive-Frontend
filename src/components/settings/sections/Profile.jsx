export default function ProfileSection() {
  return (
    <div className="bg-white border rounded-xl p-6">
      {/* TITLE */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Personal info</h2>
          <p className="text-sm text-gray-500">
            Update your personal details here
          </p>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm border rounded-md">
            Cancel
          </button>
          <button className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md">
            Save
          </button>
        </div>
      </div>

      {/* FORM */}
      <div className="space-y-6">
        {/* Name */}
        <div>
          <label className="text-sm text-gray-600">Name</label>
          <div className="flex gap-3 mt-1">
            <input
              className="w-full border rounded-md p-2 text-sm"
              placeholder="First name"
            />
            <input
              className="w-full border rounded-md p-2 text-sm"
              placeholder="Last name"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            className="w-full border rounded-md p-2 text-sm mt-1"
            placeholder="Enter email"
          />
        </div>

        {/* Profile Photo */}
        <div>
          <label className="text-sm text-gray-600">Your photo</label>

          <div className="flex items-center gap-4 mt-2">
            <div className="w-12 h-12 rounded-full bg-gray-200" />

            <div className="flex-1 border border-dashed rounded-lg p-4 text-center text-sm text-gray-500">
              Click to upload or drag & drop
            </div>
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="text-sm text-gray-600">Role</label>
          <input
            className="w-full border rounded-md p-2 text-sm mt-1"
            placeholder="Product Designer"
          />
        </div>
      </div>
    </div>
  );
}
