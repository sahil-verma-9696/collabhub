import * as ActivityRepo from "../repos/ActivityRepo.js";
import { emitProjectActivity } from "../socket/emitters.js";

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

  return activity;
}
