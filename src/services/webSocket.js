import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectWebSocket = (messageRecieved) => {
  const socket = new SockJS("http://localhost:8080/ws");

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    connectHeaders: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    onConnect: () => {
      console.log("Connection established Successfully");
      const username = JSON.parse(localStorage.getItem("user"))?.username;

      stompClient.subscribe(`/user/${username}/queue/messages`, (message) => {
        const body = JSON.parse(message.body);
        messageRecieved(body);
      });
    },
  });

  stompClient.activate();
};

export const sendMessage = (message) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(message),
    });
  }
};
