/**
 * Socket.io Configuration and Event Handlers
 * Handles real-time communication with authentication
 */
import { Server } from "socket.io";
import { verifySocketToken } from "../middleware/authMiddleware.js";
import config from "../config/env.js";

export default function createSocketManager(server) {
  const io = new Server(server, {
    cors: {
      origin: [config.SOCKET_IO_ORIGIN, config.CLIENT_ORIGIN],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  /**
   * Auth middleware
   */
  io.use((socket, next) => {
    const token =
      socket.handshake.auth.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    if (!token) return next(new Error("Authentication token required"));

    const user = verifySocketToken(token);
    if (!user) return next(new Error("Invalid or expired token"));

    socket.userId = user.id;
    socket.user = user;

    next();
  });

  /**
   * Event handlers
   */
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.userId})`);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);

      socket.broadcast.to(roomId).emit("user-joined", {
        userId: socket.userId,
        userName: socket.user.name,
        userAvatar: socket.user.avatar,
      });

      console.log(`User ${socket.user.name} joined room ${roomId}`);
    });

    socket.on("leave-room", (roomId) => {
      socket.leave(roomId);

      socket.broadcast.to(roomId).emit("user-left", {
        userId: socket.userId,
        userName: socket.user.name,
      });

      console.log(`User ${socket.user.name} left room ${roomId}`);
    });

    socket.on("send-message", ({ roomId, message }) => {
      io.to(roomId).emit("receive-message", {
        userId: socket.userId,
        userName: socket.user.name,
        userAvatar: socket.user.avatar,
        message,
        timestamp: new Date(),
      });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.name} (${socket.userId})`);

      socket.broadcast.emit("user-disconnected", {
        userId: socket.userId,
        userName: socket.user.name,
      });
    });

    socket.on("get-room-users", (roomId, callback) => {
      const room = io.sockets.adapter.rooms.get(roomId);
      const users = [];

      if (room) {
        room.forEach((socketId) => {
          const s = io.sockets.sockets.get(socketId);

          users.push({
            userId: s.userId,
            userName: s.user.name,
            userAvatar: s.user.avatar,
          });
        });
      }

      callback(users);
    });

    socket.on("send-private-message", ({ targetUserId, message }) => {
      io.sockets.sockets.forEach((s) => {
        if (s.userId === targetUserId) {
          s.emit("receive-private-message", {
            fromUserId: socket.userId,
            fromUserName: socket.user.name,
            message,
            timestamp: new Date(),
          });
        }
      });
    });
  });

  /**
   * Public API
   */
  function getIO() {
    return io;
  }

  function broadcast(event, data) {
    io.emit(event, data);
  }

  function broadcastToRoom(roomId, event, data) {
    io.to(roomId).emit(event, data);
  }

  function sendToUser(userId, event, data) {
    io.sockets.sockets.forEach((socket) => {
      if (socket.userId === userId) socket.emit(event, data);
    });
  }

  return {
    io,
    getIO,
    broadcast,
    broadcastToRoom,
    sendToUser,
  };
}
