export default function ToggleSwitch({ enabled, setEnabled }) {
  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`w-14 h-8 flex items-center rounded-full p-1 transition ${
        enabled ? "bg-green-600" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-6 h-6 rounded-full shadow-md transform transition ${
          enabled ? "translate-x-6" : ""
        }`}
      />
    </button>
  );
}
