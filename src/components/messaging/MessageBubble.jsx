import { Clock } from "lucide-react";

export default function MessageBubble({ message, isOwn, timestamp }) {
  const formatTime = (ts) => {
    if (!ts) return "";
    try {
      const date = new Date(ts);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"} space-y-1`}>
      <div
        className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm transition-all duration-300 border ${
          isOwn
            ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-br-none border-rose-400/20 shadow-rose-950/10"
            : "bg-slate-800/80 text-slate-100 rounded-bl-none border-slate-700/50 shadow-slate-950/20"
        }`}
      >
        {message}
      </div>
      
      {timestamp && (
        <span className="flex items-center gap-1 text-[10px] text-slate-400 px-1">
          <Clock size={10} />
          {formatTime(timestamp)}
        </span>
      )}
    </div>
  );
}
