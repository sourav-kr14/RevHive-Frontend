import ChatWindow from "./ChatWindow";
import ChatList from "./ChatList";
import { useState } from "react";

export default function MessagingLayout() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex h-screen bg-[#0d0d1f] text-white">
      {/* LEFT PANEL */}
      <div className="w-1/4 min-w-[260px] border-r border-white/10 bg-white/5 backdrop-blur-xl">
        <ChatList
          setSelectedUser={setSelectedUser}
          selectedUser={selectedUser} // ✅ IMPORTANT (for highlight)
        />
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <ChatWindow selectedUser={selectedUser} />
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-400 text-lg">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
