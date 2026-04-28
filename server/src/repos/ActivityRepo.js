/**
 * Activity Repository
 * Handles activity persistence for project scoped user actions.
 */

import Model from "../models/ActivitySchema.js";
import { ObjectId } from "../utils/ObjectId.js";
import { handleMongoDbErrors } from "../utils/handleMongoDBError.js";

export async function create(payload, options = {}) {
  if (!payload.project) throw new Error("project is required");
  if (!payload.user) throw new Error("user is required");
  if (!payload.action) throw new Error("action is required");

  const doc = new Model({
    ...payload,
    project: ObjectId(payload.project),
    user: ObjectId(payload.user),
    resourceId: payload.resourceId ? ObjectId(payload.resourceId) : undefined,
  });

  return await handleMongoDbErrors(() => doc.save(options));
}

export function getByProject(
  projectId,
  { limit = 100, skip = 0, action, resourceType } = {},
) {
  if (!projectId) throw new Error("projectId is required");

  const query = { project: ObjectId(projectId) };

  if (action) query.action = action;
  if (resourceType) query.resourceType = resourceType;

  return Model.find(query)
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit))
    .populate("user", "name email");
}
