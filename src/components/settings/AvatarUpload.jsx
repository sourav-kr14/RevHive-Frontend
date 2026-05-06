export default function AvatarUpload() {
  return (
    <div className="flex items-center gap-5">
      <img
        src="https://i.pravatar.cc/100"
        alt=""
        className="w-20 h-20 rounded-full object-cover"
      />

      <label className="border border-dashed border-gray-300 rounded-xl px-6 py-5 cursor-pointer hover:bg-gray-50">
        <input type="file" hidden />
        <span className="text-sm text-gray-500">Upload Profile Photo</span>
      </label>
    </div>
  );
}
