export default function MessageBubble({ message }) {
  return (
    <div
      className={`flex ${
        message.sender === "me" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`px-4 py-2 rounded-2xl max-w-xs ${
          message.sender === "me" ? "bg-purple-600" : "bg-white/10"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
