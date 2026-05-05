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
      {/* HEADER */}
      <div className="p-4 border-b">
        <h2 className="font-semibold">Getting Started</h2>
        <p className="text-sm text-gray-500">4 members, 1 online</p>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <MessageBubble />
      </div>

      {/* INPUT */}
      <div className="p-3 border-t">
        <MessageInput />
      </div>
    </div>
  );
}
