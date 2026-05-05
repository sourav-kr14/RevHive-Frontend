export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className="bg-gray-200 px-4 py-2 rounded-xl max-w-xs">{message}</div>
    </div>
  );
}
