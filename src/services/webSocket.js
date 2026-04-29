import SockJS from "sockjs-client";
import Stomp from "stompjs";

let stompClient = null;

export const connectWebSocket = (token, onMessageReceived) => {
  const socket = new SockJS("http://localhost:8080/chat");
  stompClient = Stomp.over(socket);

  stompClient.connect(
    {
      Authorization: "Bearer " + token,
    },
    () => {
      console.log("✅ Connected to WebSocket");

      // Subscribe to private messages
      stompClient.subscribe("/user/queue/messages", (message) => {
        if (message.body) {
          onMessageReceived(JSON.parse(message.body));
        }
      });
    },
    (error) => {
      console.error("❌ WebSocket error:", error);
    },
  );
};

export const sendMessage = (receiver, content) => {
  if (stompClient) {
    stompClient.send(
      "/app/chat.sendMessage",
      {},
      JSON.stringify({
        receiver,
        content,
      }),
    );
  }
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.disconnect();
  }
};
