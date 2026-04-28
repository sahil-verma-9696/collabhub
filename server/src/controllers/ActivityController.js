import * as ActivityRepo from "../repos/ActivityRepo.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getProjectActivities = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { limit, skip, action, resourceType } = req.query;

  const activities = await ActivityRepo.getByProject(projectId, {
    limit: limit ? Number(limit) : undefined,
    skip: skip ? Number(skip) : undefined,
    action,
    resourceType,
  });

  res.json(activities);
});
