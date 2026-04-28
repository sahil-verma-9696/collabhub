import { formatOnlineUsersTable } from "../utils/formatOnlineUsersTable.js";
import logger from "../utils/logger.js";
import * as socketService from "./socketService.js";

/**
 * handleConnection
 * -------------------
 * - here we handle connect for connected users.
 * - this give socket Object that have
 * - userId, deviceId, email
 */
export function handleConnection(socket) {
  const io = socket.server;

  logger.info(
    `[ON : connection] :: name: ${socket.user.name} email: ${socket.user.email} userId: ${socket.userId}`,
  );

  socketService.addActiveUser({
    userId: socket.userId,
    deviceId: socket.data.deviceId,
    browserInfo: socket.data.browserInfo,
    socketId: socket.id,
  });

  logger.table(
    "Online Users Snapshot",
    formatOnlineUsersTable(socketService.getActiveUsers()),
  );

  socketService.brodcastActiveUsers();

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

  /**
   * Disconnect
   */
  socket.on("disconnect", () => {
    logger.info(
      `[ON : disconnect] :: name: ${socket.user.name} email: ${socket.user.email} userId: ${socket.userId}`,
    );

    socketService.removeActiveUser(socket);

    logger.table(
      "Online Users Snapshot",
      formatOnlineUsersTable(socketService.getActiveUsers()),
    );

    socketService.brodcastActiveUsers();
  });
}
