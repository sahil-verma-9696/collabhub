/**
 * User Controller
 * Handles all user-related operations
 */

import * as memberRepo from "../repos/ProjectMemberRepo.js";
import * as inviteRepo from "../repos/InviteRepo.js";
import asyncHandler from "../utils/asyncHandler.js";
import { withTransaction } from "../utils/withTransaction.js";
import { recordActivity } from "../utils/activityLogger.js";

export const getAllProjectMembers = asyncHandler(async (req, res) => {
  const members = await memberRepo.getAllProjectMembers(req.params.projectId);
  res.json(members);
});

export const updateById = asyncHandler(async (req, res) => {
  const member = await memberRepo.updateMemberRole(
    req.params.projectId,
    req.params.memberId,
    req.query.role,
  );

  await recordActivity({
    projectId: req.params.projectId,
    userId: req.user.userId,
    action: "updated member role",
    resourceType: "member",
    resourceId: req.params.memberId,
    details: { role: req.query.role },
  });

  return res.json(member);
});

export const deleteById = asyncHandler(async (req, res) => {
  const deletor = req.user.userId;

  const member = await memberRepo.getById(req.params.memberId);

  if (!member) throw new Error("Member not found");

  await withTransaction(async (session) => {
    await memberRepo.softDeleteById(member._id, deletor, { session });
    await inviteRepo.softDeleteById(member?.invite, deletor, { session });
  });

  await recordActivity({
    projectId: req.params.projectId,
    userId: req.user.userId,
    action: "removed member",
    resourceType: "member",
    resourceId: req.params.memberId,
  });

  res.json({ success: true });
});
