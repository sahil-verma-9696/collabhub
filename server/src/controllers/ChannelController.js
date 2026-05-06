import asyncHandler from "../utils/asyncHandler.js";
import * as channelRepo from "../repos/ChannelRepo.js";
// import config from "../config/env.js";
// import { withTransaction } from "../utils/withTransaction.js";

/************************************************************************
 **************************** GET ***************************************
 ************************************************************************/
export const getChannelsByProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const channels = await channelRepo.getChannelsByProject(projectId);
  res.json(channels);
});

/************************************************************************
 **************************** POST **************************************
 ************************************************************************/
export const postChannels = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const projectId = req.params.projectId;

  const channel = await channelRepo.createChannel({
    ...req.body,
    creator: userId,
    project: projectId,
  });

  return res.status(201).json(channel);
});

/************************************************************************
 **************************** PATCH *************************************
 ************************************************************************/

// export const patchEntityByAttributes = asyncHandler(async (req, res) => {});

/************************************************************************
 **************************** DELETE ************************************
 ************************************************************************/

// export const deleteEntityByAttributes = asyncHandler(async (req, res) => {});

/************************************************************************
 **************************** OTHER *************************************
 ************************************************************************/
