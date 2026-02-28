import { SOCKET_EVENTS } from "../common/constants.js";
import { socketManager } from "../server.js";
import logger from "../utils/logger.js";

// userId → Set of socketIds (supports multi-tabs)
const onlineUsers = new Map();

/**
 * Add online user to onlineUsers Map
 * ----------------------------------
 * @description Add online user to onlineUsers Map `in-memory`
 */
export function addOnlineUser({ userId, deviceId, browserInfo, socketId }) {
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, { devices: new Map() });
  }

  const user = onlineUsers.get(userId);

  if (!user.devices.has(deviceId)) {
    user.devices.set(deviceId, {
      info: browserInfo,
      sockets: new Set(),
      lastSeen: new Date(),
    });
  }

  const device = user.devices.get(deviceId);
  device.sockets.add(socketId);
  device.lastSeen = new Date();
}

/**
 * Remove online user from onlineUsers Map
 * ---------------------------------------
 * @description Cleans up socket → device → user
 */
export function removeOnlineUser(socket) {
  const { userId, deviceId } = socket.data;

  if (!userId || !deviceId) return;

  const user = onlineUsers.get(userId);
  if (!user) return;

  const device = user.devices.get(deviceId);
  if (!device) return;

  // Remove socket (tab)
  device.sockets.delete(socket.id);

  // If no tabs left on this device → remove device
  if (device.sockets.size === 0) {
    user.devices.delete(deviceId);
  }

  // If no devices left → user is fully offline
  if (user.devices.size === 0) {
    onlineUsers.delete(userId);
    return;
  }

  // OPTIONAL: device-level update
  device.lastSeen = new Date();
}

/**
 * Broadcast online users to Everyone
 * -----------------------
 */
export function brodcastOnlineUsers() {
  const activeUsers = getOnlineUsersDTO();

  socketManager.getIO().emit(SOCKET_EVENTS.ONLINE_USERS, activeUsers);
  logger.info(`EMIT : ${SOCKET_EVENTS.ONLINE_USERS}`);
}

/*************************************************************************
 ************************* PRIVATE ***************************************
 *************************************************************************/
function getOnlineUsersDTO() {
  return Array.from(onlineUsers.entries()).map(([userId, user]) => ({
    userId,
    devices: user.devices.size,
    lastSeen: Math.max(
      ...Array.from(user.devices.values()).map((d) => d.lastSeen.getTime()),
    ),
  }));
}
