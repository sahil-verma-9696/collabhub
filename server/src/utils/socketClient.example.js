/**
 * Socket.io Client Helper (Frontend Example)
 * Functional factory version
 *
 * Requires socket.io-client on frontend
 */

import { io } from "socket.io-client";

/**
 * Create Socket Client
 */
export function createSocketClient(serverUrl, token) {
  let socket = null;
  let currentRoom = null;

  /**
   * Connect to server
   */
  function connect() {
    socket = io(serverUrl, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    setupEventListeners();
    return socket;
  }

  /**
   * Base listeners
   */
  function setupEventListeners() {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
  }

  /**
   * Room helpers
   */
  function joinRoom(roomId) {
    currentRoom = roomId;
    socket.emit("join-room", roomId);
  }

  function leaveRoom() {
    if (currentRoom) {
      socket.emit("leave-room", currentRoom);
      currentRoom = null;
    }
  }

  /**
   * Messaging
   */
  function sendMessage(message) {
    if (currentRoom) {
      socket.emit("send-message", {
        roomId: currentRoom,
        message,
      });
    }
  }

  function sendPrivateMessage(userId, message) {
    socket.emit("send-private-message", {
      targetUserId: userId,
      message,
    });
  }

  function getRoomUsers(callback) {
    if (currentRoom) {
      socket.emit("get-room-users", currentRoom, callback);
    }
  }

  /**
   * Listeners
   */
  function onMessage(callback) {
    socket.on("receive-message", callback);
  }

  function onPrivateMessage(callback) {
    socket.on("receive-private-message", callback);
  }

  function onUserJoined(callback) {
    socket.on("user-joined", callback);
  }

  function onUserLeft(callback) {
    socket.on("user-left", callback);
  }

  function onUserDisconnected(callback) {
    socket.on("user-disconnected", callback);
  }

  /**
   * Disconnect
   */
  function disconnect() {
    if (socket) socket.disconnect();
  }

  return {
    connect,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendPrivateMessage,
    getRoomUsers,
    onMessage,
    onPrivateMessage,
    onUserJoined,
    onUserLeft,
    onUserDisconnected,
    disconnect,
  };
}