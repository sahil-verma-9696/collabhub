import logger from "../utils/logger.js";
import * as socketService from "./socketService.js";
import * as messageRepo from "../repos/MessageRepo.js";

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

  socket.on("join-room", (roomId) => {
    if (!roomId) return;
    socket.join(roomId);
  });

  socket.on("leave-room", (roomId) => {
    if (!roomId) return;
    socket.leave(roomId);
  });

  socket.on("get-active-users", ({ channelId }) => {
    socket.emit("get-active-users", {
      activeUsers: socketService.activeChannelUser.getResource(channelId),
    });
  });

  socket.on("message", async (body) => {
    const { channel } = body;

    const message = await messageRepo.create({ sender: user.userId, ...body });

    socket.emit("message", message);
    socket.to(channel).emit("message", message);
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
