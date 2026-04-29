import { useEffect, useState } from "react";
import {
  connectWebSocket,
  sendMessage,
  disconnectWebSocket,
} from "../services/websocket";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState("");
  const [content, setContent] = useState("");

  const token = localStorage.getItem("token"); // 🔥 your JWT

  useEffect(() => {
    if (!token) return;

    connectWebSocket(token, (msg) => {
      console.log("📩 Received:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => disconnectWebSocket();
  }, [token]);

  const handleSend = () => {
    if (!receiver || !content) return;

    sendMessage(receiver, content);

    setMessages((prev) => [...prev, { sender: "Me", receiver, content }]);

    setContent("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>💬 Chat</h2>

      <input
        type="text"
        placeholder="Receiver Email"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
      />
      <br />
      <br />

      <input
        type="text"
        placeholder="Message"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <br />
      <br />

      <button onClick={handleSend}>Send</button>

      <hr />

      <h3>Messages</h3>
      {messages.map((msg, index) => (
        <div key={index}>
          <b>{msg.sender}:</b> {msg.content}
        </div>
      ))}
    </div>
  );
}
