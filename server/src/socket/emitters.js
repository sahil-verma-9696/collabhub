let socketManager = null;

export function setSocketManager(manager) {
  socketManager = manager;
}

export function emitProjectActivity(projectId, activity) {
  if (!socketManager || !socketManager.broadcastToRoom) return;

  socketManager.broadcastToRoom(projectId, "project-activity", activity);
}
