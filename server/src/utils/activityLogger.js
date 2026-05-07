import * as ActivityRepo from "../repos/ActivityRepo.js";
import { emitProjectActivity, emitProjectStats } from "../socket/emitters.js";

export async function recordActivity({
  projectId,
  userId,
  action,
  resourceType = "other",
  resourceId = null,
  details = null,
  metadata = null,
}) {
  const activity = await ActivityRepo.create({
    project: projectId,
    user: userId,
    action,
    resourceType,
    resourceId,
    details,
    metadata,
  });

  emitProjectActivity(projectId, activity);
  emitProjectStats(projectId).catch(() => {
    // Stats emission is best-effort and should not block activity recording.
  });

  return activity;
}
