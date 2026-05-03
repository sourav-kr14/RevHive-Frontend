import { useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { connectWebSocket, sendMessage } from "../../services/webSocket";

export default function ChatWindow({ selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    connectWebSocket((incomingMessage) => {
      setMessages((prev) => [...prev, incomingMessage]);
    });
  }, []);

  const handleSend = () => {
    if (!text.trim()) return;
    const message = {
      sender: currentUser.username,
      receiver: selectedUser.username,
      content: text,
    };
    sendMessage(message);

    setMessages((prev) => [...prev, message]);
    setText("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <div key={i}>
            <b>{msg.sender}: </b> {msg.content}
          </div>
        ))}
      </div>

      {/* Messages */}
      <div className="p-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 bg-gray-800 text-white"
        />

        <button onClick={handleSend}>Send</button>
      </div>

      {/* Input */}
      <MessageInput />
    </div>
  );
}
