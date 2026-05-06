export default function InputField({ label, type = "text", ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-black">{label}</label>

      <input
        type={type}
        {...props}
        className="
        w-full
        border
        border-gray-300
        bg-white
        text-black
        rounded-xl
        px-4
        py-3
        outline-none
        focus:ring-2
        focus:ring-purple-500
        placeholder:text-gray-400
        "
      />
    </div>
  );
}
