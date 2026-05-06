import InputField from "./InputField";

export default function SecuritySection() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-semibold">Security</h2>

          <p className="text-gray-500 text-sm mt-1">Update your password</p>
        </div>

        <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl">
          Update
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <InputField label="Current Password" type="password" />

        <InputField label="New Password" type="password" />

        <InputField label="Confirm Password" type="password" />
      </div>
    </div>
  );
}
