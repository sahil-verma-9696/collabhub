import * as inviteRepo from "../repos/InviteRepo.js";
import * as tokenService from "../utils/token.service.js";
import * as projectMemberRepo from "../repos/ProjectMemberRepo.js";
import projectRepo from "../repos/ProjectRepo.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendInviteEmail } from "../utils/email.service.js";
import { PROJECT_ROLE } from "../common/constants.js";
import { withTransaction } from "../utils/withTransaction.js";
import { recordActivity } from "../utils/activityLogger.js";

/**
 * Create Invite with email
 */
export const create = asyncHandler(async (req, res) => {
  const email = req.query.email;
  const role = req.query.role;
  const projectId = req.params.projectId;

  const members = await projectMemberRepo.getAllProjectMembers(projectId);

  const teamLimit = await projectRepo.getProjectTeamLimit(projectId);

  if (members.length >= teamLimit)
    throw new Error(`Project is full ${members.length}`);

  if (email === req.user.email) throw new Error("You can't invite yourself");

  const inviteCode = tokenService.generateInviteToken({
    sender: req.user.userId,
    email,
    role: role ?? PROJECT_ROLE.READ,
    project: projectId,
  });

  let invite = null;

  const existingDeletedInvite = await inviteRepo.getDeletedByEmail(email);

  if (existingDeletedInvite) {
    // Restore
    invite = await inviteRepo.restoreById(existingDeletedInvite._id, {
      sender: req.user.userId,
      role: role ?? PROJECT_ROLE.READ,
      code: inviteCode,
    });
  } else {
    // Create New one
    invite = await inviteRepo.create({
      sender: req.user.userId,
      email,
      role: role ?? PROJECT_ROLE.READ,
      project: projectId,
      code: inviteCode,
    });
  }

  // Async send email
  sendInviteEmail(email, inviteCode, projectId);

  await recordActivity({
    projectId,
    userId: req.user.userId,
    action: "created invite",
    resourceType: "invite",
    resourceId: invite._id,
    details: { email, role: role ?? PROJECT_ROLE.READ },
  });

  return res.status(201).json(invite);
});

export const getById = asyncHandler(async (req, res) => {
  const invite = await inviteRepo.getById(req.params.inviteId);
  return res.json(invite);
});

export const getInvites = asyncHandler(async (req, res, next) => {
  const projectId = req.params.projectId;
  const query = req.query || {};

  let invites = await inviteRepo.getByFilter({
    ...query,
    project: projectId,
  });

  return res.json(invites);
});

/**
 * Get all project invites
 */
export const getByProject = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId;

  const invites = await inviteRepo.getByProject(projectId);

  return res.json(invites);
});

/**
 * Accept invite
 */
export const accept = asyncHandler(async (req, res) => {
  const code = req.query.code;

  const payload = tokenService.verifyInviteToken(code);

  const isValidRecipientEmail = req.user.email === payload.email;

  if (!isValidRecipientEmail) throw new Error("Invalid recipient email");

  const invites = await inviteRepo.getByEmail(payload.email);

  if (!invites.length) throw new Error("Invite not found");

  let newMember = null;

  const existingMember =
    await projectMemberRepo.getDeletedMemberByProjectAndUser(
      payload.project,
      req.user.userId,
    );

  if (existingMember) {
    // Restore Project member
    await withTransaction(async (session) => {
      newMember = await projectMemberRepo.restoreById(
        existingMember._id,
        {
          user: req.user.userId,
          role: payload.role,
        },
        { session },
      );

      await inviteRepo.updateAcceptanceByEmail(
        payload.email,
        {
          receiver: req.user.userId,
        },
        { session },
      );
    });
  } else {
    // Create New project member
    await withTransaction(async (session) => {
      newMember = await projectMemberRepo.create(
        {
          project: payload.project,
          invite: invites[0]._id,
          user: req.user.userId,
          role: payload.role,
        },
        { session },
      );

      await inviteRepo.updateAcceptanceByEmail(
        payload.email,
        {
          receiver: req.user.userId,
        },
        { session },
      );
    });
  }

  await recordActivity({
    projectId: payload.project,
    userId: req.user.userId,
    action: "accepted invite",
    resourceType: "invite",
    resourceId: invites[0]._id,
    details: { role: payload.role, email: payload.email },
  });

  res.status(200).json(newMember);
});

/**
 * Delete invite
 */
export const deleteById = asyncHandler(async (req, res) => {
  await inviteRepo.softDeleteById(req.params.inviteId, req.user.userId);

  await recordActivity({
    projectId: req.params.projectId,
    userId: req.user.userId,
    action: "deleted invite",
    resourceType: "invite",
    resourceId: req.params.inviteId,
  });

  return res.json({ message: "Invite deleted successfully" });
});
