import ProjectRepo from "../repos/ProjectRepo.js";
import asyncHandler from "../utils/asyncHandler.js";
import { withTransaction } from "../utils/withTransaction.js";
import * as projectMemberRepo from "../repos/ProjectMemberRepo.js";
import { createDefaultFiltersAndValue } from "../utils/createDefaultFiltersAndValue.js";
import * as inviteRepo from "../repos/InviteRepo.js";
import * as filterRepo from "../repos/FilterRepo.js";
import * as filterValueRepo from "../repos/FilterValueRepo.js";
import { recordActivity } from "../utils/activityLogger.js";
import { getProjectStats } from "../utils/projectStats.js";

export const createProject = asyncHandler(async (req, res) => {
  const project = await ProjectRepo.create({
    ...req.body,
    owner: req.user.userId,
  });

  await createDefaultFiltersAndValue(project._id, req.user.userId);
  await recordActivity({
    projectId: project._id,
    userId: req.user.userId,
    action: "created project",
    resourceType: "project",
    resourceId: project._id,
    details: { name: project.name },
  });

  res.status(201).json(project);
});

export const getAllProjects = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const projects = await ProjectRepo.findAll({
    owner: userId,
  });

  const joinedProjects = await ProjectRepo.getJoinedProjects(userId);

  res.json({ owned: projects, joined: joinedProjects });
});

export const getProject = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId;
  const userId = req.user.userId;

  const project = await ProjectRepo.getProjectAndUserRole(projectId, userId);

  res.json(project);
});

export const updateProject = asyncHandler(async (req, res) => {
  const updated = await ProjectRepo.update(req.params.projectId, req.body);

  if (!updated) {
    throw new Error(
      JSON.stringify({ message: "Error updating project", status: 500 }),
    );
  }

  await recordActivity({
    projectId: req.params.projectId,
    userId: req.user.userId,
    action: "updated project",
    resourceType: "project",
    resourceId: req.params.projectId,
    details: req.body,
  });

  res.json(updated);
});

export const deleteProject = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId;
  const userId = req.user.userId;

  const result = await withTransaction(async (session) => {
    const project = await ProjectRepo.softDeleteById(projectId, userId, {
      session,
    });
    const members = await projectMemberRepo.deleteByProject(projectId, userId, {
      session,
    });
    const invites = await inviteRepo.deleteByProject(projectId, userId, {
      session,
    });

    const filters = await filterRepo.getByProject(projectId);

    for (const filter of filters) {
      await filterValueRepo.deleteByFilter(filter._id, { session });
      await filterRepo.deleteById(filter._id, userId, { session });
    }

    return { project, members, invites };
  });

  await recordActivity({
    projectId,
    userId,
    action: "deleted project",
    resourceType: "project",
    resourceId: projectId,
    details: result,
  });

  res.json({ message: "Project deleted successfully", result });
});

export const getProjectStatsController = asyncHandler(async (req, res) => {
  const projectStats = await getProjectStats(req.params.projectId);
  res.json(projectStats);
});
