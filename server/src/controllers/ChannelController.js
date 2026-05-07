import asyncHandler from "../utils/asyncHandler.js";
import * as channelRepo from "../repos/ChannelRepo.js";
import * as channelParticipantsRepo from "../repos/ChannelParticipantRepo.js";
import * as messageRepo from "../repos/MessageRepo.js";
import { recordActivity } from "../utils/activityLogger.js";

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

export const getChannel = asyncHandler(async (req, res) => {
  const { projectId, channelId } = req.params;
  const channel = await channelRepo.getById(channelId);
  res.json(channel);
});

/************************************************************************
 **************************** POST **************************************
 ************************************************************************/
export const postChannels = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const projectId = req.params.projectId;

  const { members, ...body } = req.body || {};

  const channel = await channelRepo.create({
    ...body,
    creator: userId,
    project: projectId,
  });

  if (members && members.length > 0) {
    for (const member of members) {
      await channelParticipantsRepo.create({
        channel: channel._id,
        user: member,
        addBy: userId,
      });
    }
  }

  await recordActivity({
    projectId,
    userId,
    action: `Created channel ${channel.name}`,
    resourceType: "channel",
    resourceId: channel._id,
    details: {
      channelName: channel.name,
      description: channel.description || null,
      memberCount: members?.length ?? 0,
    },
    metadata: {
      priority: "medium",
      channelId: channel._id,
    },
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

export const deleteChannel = asyncHandler(async (req, res) => {
  const { projectId, channelId } = req.params;

  await channelParticipantsRepo.deleteByChannelId(channelId);
  await messageRepo.hardDeleteByChannelId(channelId);
  await channelRepo.hardDeleteById(projectId, channelId);

  await recordActivity({
    projectId,
    userId: req.user.userId,
    action: "deleted channel",
    resourceType: "channel",
    resourceId: channelId,
  });

  res.json({ message: "Channel deleted successfully" });
});

/************************************************************************
 **************************** OTHER *************************************
 ************************************************************************/
