import asyncHandler from "../utils/asyncHandler.js";
import * as repo from "../repos/TaskAssignmentRepo.js";
import config from "../config/env.js";
import { withTransaction } from "../utils/withTransaction.js";

/************************************************************************
 **************************** GET ***************************************
 ************************************************************************/
// export const getAll = asyncHandler(async (req, res) => {
//   const users = await userRepo.getAll();
//   res.json(users);
// });

/************************************************************************
 **************************** POST **************************************
 ************************************************************************/
export const postTaskAssignment = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;

  const { user } = req.body;

  const assignor = req.user.userId;

  const assignment = await repo.create({
    project: projectId,
    task: taskId,
    user,
    assignor,
  });

  res.status(200).json({
    message: "Assignment created successfully",
    payload: assignment,
  });
});

/************************************************************************
 **************************** PATCH *************************************
 ************************************************************************/

// export const patchEntityByAttributes = asyncHandler(async (req, res) => {});

/************************************************************************
 **************************** DELETE ************************************
 ************************************************************************/

export const deleteTaskAssignment = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;

  const { user } = req.body;

  const assignor = req.user.userId;

  await repo.hardDeleteByUser(taskId, user, { session: null });

  res.status(200).json({ message: "Assignment deleted successfully" });
});

/************************************************************************
 **************************** OTHER *************************************
 ************************************************************************/
