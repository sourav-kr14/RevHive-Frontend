import SockJS from "sockjs-client";
import Stomp from "stompjs";

let stompClient = null;
let socket = null;
const chatListeners = new Set();
const notificationListeners = new Set();
let chatSubscription = null;
let notificationSubscription = null;

const getUserId = () => {
  try {
    return JSON.parse(localStorage.getItem("user"))?.id;
  } catch {
    return null;
  }
};

const subscribeTopics = () => {
  if (!stompClient || !stompClient.connected) return;

  // Subscribe to public chat topic once and keep it active
  if (!chatSubscription) {
    chatSubscription = stompClient.subscribe("/topic/messages", (message) => {
      console.log("MESSAGE RECEIVED:", message.body);
      if (message.body) {
        try {
          const parsed = JSON.parse(message.body);
          chatListeners.forEach((listener) => listener(parsed));
        } catch (e) {
          console.error("Error parsing chat message:", e);
        }
      }
    });
    console.log(" Subscribed to public chat topic /topic/messages");
  }

  // Subscribe to notifications topic once and keep it active
  const userId = getUserId();
  if (userId && !notificationSubscription) {
    notificationSubscription = stompClient.subscribe(
      `/topic/notifications/${userId}`,
      (message) => {
        if (message.body) {
          try {
            const parsed = JSON.parse(message.body);
            notificationListeners.forEach((listener) => listener(parsed));
          } catch (e) {
            console.error("Error parsing notification message:", e);
          }
        }
      },
    );
    console.log(`Subscribed to notifications topic for user ${userId}`);
  }
};

export const connectWebSocket = (token, type, callback) => {
  if (type === "chat" && callback) chatListeners.add(callback);
  if (type === "notification" && callback) notificationListeners.add(callback);

  // If already connected, ensure subscriptions are active and reuse the connection
  if (stompClient && stompClient.connected) {
    console.log("🔌 Reusing persistent WebSocket connection");
    subscribeTopics();
    return;
  }

  // If connection is in progress, wait
  if (socket?.readyState === 0) {
    console.log("🔌 Connection in progress, waiting...");
    return;
  }

  const gatewayUrl =
    import.meta.env.VITE_BACKEND_URL ||
    (import.meta.env.DEV ? "http://localhost:8080" : window.location.origin);
  socket = new SockJS(`${gatewayUrl}/api/chat`);
  stompClient = Stomp.over(socket);

  stompClient.debug = () => {};

  stompClient.connect(
    {
      Authorization: `Bearer ${token}`,
    },
    () => {
      console.log(" WebSocket connected successfully");
      subscribeTopics();
    },
    (error) => {
      console.error(" WebSocket connection error:", error);

      setTimeout(() => {
        const total = chatListeners.size + notificationListeners.size;
        if (total > 0 && token) {
          connectWebSocket(token);
        }
      }, 5000);
    },
  );
};

export const sendMessage = (message) => {
  if (stompClient && stompClient.connected) {
    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(message));
  } else {
    console.warn(" Cannot send message: WebSocket is not connected.");
  }
};

export const disconnectWebSocket = (type, callback) => {
  if (type === "chat" && callback) chatListeners.delete(callback);
  if (type === "notification" && callback)
    notificationListeners.delete(callback);

  console.log(` Removed ${type} listener. Connection remains persistent.`);
};
