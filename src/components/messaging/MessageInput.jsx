import { useState } from "react";
import { Send } from "lucide-react";

export default function MessageInput() {
  const [text, setText] = useState("");

  const sendMessage = () => {
    console.log(text);
    setText("");
  };

  return (
    <div className="p-4 border-t border-white/10 flex gap-2">
      <input
        type="text"
        className="flex-1 bg-white/10 rounded-xl px-4 py-2 outline-none"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={sendMessage} className="bg-purple-600 p-2 rounded-xl">
        <Send size={18} />
      </button>
    </div>
  );
}
