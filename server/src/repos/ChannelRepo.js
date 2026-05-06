/**
 * Repository
 * Handles all database operations
 * Based on ER Diagram Schema
 */

import Model from "../models/ChannelSchema.js";
import { ObjectId } from "../utils/ObjectId.js";
import { handleMongoDbErrors } from "../utils/handleMongoDBError.js";

/************************************************************************
 **************************** CREATE ************************************
 ************************************************************************/

export async function create(payload, options = {}) {
  const doc = new Model({
    ...payload,
    project: ObjectId(payload.project),
    creator: ObjectId(payload.creator),
  });

  return await handleMongoDbErrors(() => doc.save(options));
}

/************************************************************************
 **************************** READ **************************************
 ************************************************************************/

export async function getById(id, options = { session: null }) {
  if (!id) throw new Error("_id of page is required");

  return await Model.findOne({ _id: id }).session(options.session);
}

export async function getChannelsByProject(
  projectId,
  options = { session: null },
) {
  if (!projectId) throw new Error("projectId is required");

  return await Model.find({
    project: ObjectId(projectId),
  }).session(options.session);
}

export async function getChannelCreator(channelId, options = { session: null }) {
  if (!channelId) throw new Error("channelId is required");

  return await Model.findOne({
    _id: ObjectId(channelId),
  })
    .select("creator")
    .populate("creator") // expand creator
    .lean()
    .session(options.session);
}

/************************************************************************
 **************************** UPDATE ************************************
 ************************************************************************/

// export async function restoreById(id, payload = {}, options = { session: null }) {
//   if (!id) throw new Error("memberId is required");

//   return await handleMongoDbErrors(() =>
//     Model.findOneAndUpdate(
//       { _id: ObjectId(id) },
//       {
//         $set: {
//           ...payload,
//           user: ObjectId(payload.user),
//           isDeleted: false,
//           deletedAt: null,
//           deletor: null,
//         },
//       },
//       { new: true, session: options.session },
//     ),
//   );
// }

/************************************************************************
 **************************** DELETE ************************************
 ************************************************************************/

// export async function softDeleteById(id, deletor, options = { session: null }) {
//   if (!id) throw new Error("memberId is required");

//   if (!deletor) throw new Error("deletor is required");

//   return await Model.updateOne(
//     { _id: id },
//     {
//       $set: {
//         isDeleted: true,
//         deletor: ObjectId(deletor),
//         deletedAt: new Date(),
//       },
//     },
//       { new: true, session: options.session },
//   );
// }

export async function hardDeleteById(
  projectId,
  channelId,
  options = { session: null },
) {
  if (!channelId) throw new Error("memberId is required");

  return await Model.deleteOne(
    { _id: ObjectId(channelId), project: ObjectId(projectId) },
    { session: options.session },
  );
}
