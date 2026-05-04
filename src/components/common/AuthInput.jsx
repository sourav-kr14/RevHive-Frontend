export default function AuthInput({ type, placeholder, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
    />
  );
}
