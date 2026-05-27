import { useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { connectWebSocket, sendMessage } from "../../services/webSocket";

export default function ChatWindow({ selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    connectWebSocket((incomingMessage) => {
      setMessages((prev) => [...prev, incomingMessage]);
    });
  }, []);

  const handleSend = () => {
    if (!text.trim()) return;
    const message = {
      sender: currentUser?.username || "Anonymous",
      receiver: selectedUser?.name || "All",
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
        <h2 className="font-semibold">
          {selectedUser ? selectedUser.name : "Getting Started"}
        </h2>
        <p className="text-sm text-gray-500">
          {selectedUser ? (selectedUser.online ? "Online" : "Offline") : "Select a user to chat"}
        </p>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages
          .filter(
            (msg) =>
              !selectedUser ||
              (msg.sender === currentUser?.username && msg.receiver === selectedUser.name) ||
              (msg.sender === selectedUser.name && msg.receiver === currentUser?.username),
          )
          .map((msg, idx) => (
            <MessageBubble
              key={idx}
              message={msg.content}
              isOwn={msg.sender === currentUser?.username}
            />
          ))}
      </div>

      {/* INPUT */}
      <div className="p-3 border-t">
        <MessageInput text={text} setText={setText} handleSend={handleSend} />
      </div>
    </div>
  );
}
