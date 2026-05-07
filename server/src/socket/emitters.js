import { getProjectStats } from "../utils/projectStats.js";

let socketManager = null;

export function setSocketManager(manager) {
  socketManager = manager;
}

export function emitProjectActivity(projectId, activity) {
  if (!socketManager || !socketManager.broadcastToRoom) return;

  socketManager.broadcastToRoom(projectId, "project-activity", activity);
}

export async function emitProjectStats(projectId) {
  if (!socketManager || !socketManager.broadcastToRoom) return;

  const stats = await getProjectStats(projectId);
  socketManager.broadcastToRoom(projectId, "project-stats", stats);
}
