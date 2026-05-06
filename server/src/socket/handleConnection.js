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

  const { user } = socket.data;

  logger.info(
    `[ON : connection] :: Email: ${user.email} userId: ${user.userId}`,
  );

  socket.on("join-channel", ({ channelId }) => {
    socket.join(channelId);

    socketService.activeChannelUser.add(channelId, user.userId, socket.id);

    socket.to(channelId).emit("user-joined-channel", {
      userId: user.userId,
      activeUsers: socketService.activeChannelUser.getResource(channelId),
    });

    console.log(socketService.activeChannelUser.toString());
  });

  socket.on("leave-channel", ({ channelId }) => {
    socketService.activeChannelUser.removeSocket(
      channelId,
      user.userId,
      socket.id,
    );

    socket.to(channelId).emit("user-leave-channel", {
      userId: user.userId,
      activeUsers: socketService.activeChannelUser.getResource(channelId),
    });

    socket.leave(channelId);
  });

  socket.on("get-active-users", ({ channelId }) => {
    socket.emit("get-active-users", {
      activeUsers: socketService.activeChannelUser.getResource(channelId),
    });
  });

  /**
   * Disconnect
   */
  socket.on("disconnect", () => {
    logger.error(
      `[ON : disconnect] :: Email: ${user.email} userId: ${user.userId}`,
    );
    socketService.activeChannelUser.removeBySocketId(socket.id);
  });

  // socket.emit("leave-channel",{activeUser: socketService.activeChannelUser.});
}
