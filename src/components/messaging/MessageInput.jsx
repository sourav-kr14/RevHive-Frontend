import { Send } from "lucide-react";

export default function MessageInput({ text, setText, handleSend }) {
  const sendMessage = () => {
    if (handleSend) {
      handleSend();
    } else {
      console.log(text);
      if (setText) setText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex gap-2 w-full items-center">
      <input
        type="text"
        className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-2xl px-4 py-3 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all duration-300 text-sm md:text-base shadow-inner"
        placeholder="Type a message..."
        value={text || ""}
        onChange={(e) => setText && setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button
        onClick={sendMessage}
        className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-3 rounded-2xl shadow-md shadow-rose-500/10 hover:shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center"
      >
        <Send size={18} />
      </button>
    </div>
  );
}
