import AvatarUpload from "./AvatarUpload";
import InputField from "./InputField";

export default function ProfileSection() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-semibold">Profile Settings</h2>

          <p className="text-gray-500 text-sm mt-1">
            Update your profile information
          </p>
        </div>

        <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl">
          Save
        </button>
      </div>

      <div className="space-y-8">
        <AvatarUpload />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField label="Username" placeholder="John Doe" />

          <InputField
            label="Email"
            type="email"
            placeholder="john@example.com"
          />

          <InputField label="Date of Birth" type="date" />

          <InputField label="Avatar URL" placeholder="https://" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Bio</label>

          <textarea
            rows="5"
            placeholder="Write something..."
            className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
    </div>
  );
}
