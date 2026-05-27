import ChatWindow from "./ChatWindow";
import ChatList from "./ChatList";
import { useState } from "react";

export default function MessagingLayout() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex h-screen">
      {/* LEFT SIDEBAR */}
      <div className="w-xs border-r">
        <ChatList setSelectedUser={setSelectedUser} />
      </div>

      {/* RIGHT CHAT */}
      <div className="w-3/4 flex flex-col">
        <ChatWindow selectedUser={selectedUser} />
      </div>
    </div>
  );
}
