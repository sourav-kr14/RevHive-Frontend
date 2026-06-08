import { useEffect, useState, useRef } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { connectWebSocket, sendMessage, disconnectWebSocket } from "../../services/webSocket";
import { chatAPI } from "../../services/api";
import { MessageSquare, Shield, Smile } from "lucide-react";

export default function ChatWindow({ selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  // 1. Fetch message history from DB when selectedUser changes
  useEffect(() => {
    if (!currentUser?.id || !selectedUser?.id) {
      setMessages([]);
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await chatAPI.getChatHistory(currentUser.id, selectedUser.id);
        const history = res.data?.data || res.data || [];
        setMessages(history);

        // Mark incoming messages as read when opening a conversation
        await chatAPI.markAsRead(selectedUser.id, currentUser.id);
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };

    fetchHistory();
  }, [selectedUser?.id, currentUser?.id]);

  // 2. Subscribe to WebSocket messages for the active conversation
  useEffect(() => {
    if (!currentUser?.id || !selectedUser?.id) return;

    const token = localStorage.getItem("token");
    const callback = (incomingMessage) => {
      const isRelevant =
        (incomingMessage.senderId === currentUser.id && incomingMessage.receiverId === selectedUser.id) ||
        (incomingMessage.senderId === selectedUser.id && incomingMessage.receiverId === currentUser.id);

      if (isRelevant) {
        // If the message is incoming, mark it read on the backend
        if (incomingMessage.senderId === selectedUser.id) {
          chatAPI.markAsRead(selectedUser.id, currentUser.id).catch((err) => {
            console.error("Failed to mark incoming message as read:", err);
          });
        }

        setMessages((prev) => {
          // Prevent duplicates
          if (incomingMessage.id && prev.some((m) => m.id === incomingMessage.id)) {
            return prev;
          }
          return [...prev, incomingMessage];
        });
      }
    };

    connectWebSocket(token, "chat", callback);

    return () => {
      disconnectWebSocket("chat", callback);
    };
  }, [selectedUser?.id, currentUser?.id]);

  // 3. Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim() || !selectedUser || !currentUser) return;

    const messagePayload = {
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      senderUsername: currentUser.username,
      receiverUsername: selectedUser.username,
      content: text,
    };

    sendMessage(messagePayload);
    setText("");
  };

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 h-full bg-slate-50/30 text-slate-500 p-8 text-center select-none">
        <div className="p-4 bg-white/80 rounded-3xl border border-slate-200/50 mb-4 shadow-sm">
          <MessageSquare size={44} className="text-rose-500 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-1">Your Inbox</h3>
        <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
          Select a followed user from the conversation list to start real-time messaging.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white/35">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {selectedUser.avatarUrl ? (
            <img
              src={selectedUser.avatarUrl}
              alt={selectedUser.username}
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-100"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
              {selectedUser.username?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="font-bold text-slate-800 leading-none mb-1">
              {selectedUser.username}
            </h2>
            <p className="text-xs text-emerald-600 flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Active Follower
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500 text-xs bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200/60 font-medium">
          <Shield size={13} className="text-rose-500" />
          <span>Encrypted Direct Messaging</span>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/30">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm select-none">
            <Smile size={32} className="mb-2 text-slate-350" />
            <p>No messages yet. Send a friendly hello!</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <MessageBubble
              key={msg.id || idx}
              message={msg.content}
              isOwn={msg.senderId === currentUser?.id || msg.senderUsername === currentUser?.username}
              timestamp={msg.timestamp}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-slate-200/80 bg-white/95 backdrop-blur-md">
        <MessageInput text={text} setText={setText} handleSend={handleSend} />
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
}
