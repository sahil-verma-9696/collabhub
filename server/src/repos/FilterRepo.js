/**
 * User Repository
 * Handles all database operations related to users
 * Based on ER Diagram Schema
 */
import Model from "../models/FilterSchema.js";
import { ObjectId } from "../utils/ObjectId.js";

/************************************************************************
 **************************** CREATE ************************************
 ************************************************************************/
export async function create(projectId, payload, userId) {
  const doc = await Model.create({
    project: ObjectId(projectId),
    ...payload,
    creator: ObjectId(userId),
  });

  return doc;
}

/************************************************************************
 **************************** READ **************************************
 ************************************************************************/
export async function getByProject(projectId) {
  const projectFilter = await Model.find({
    project: ObjectId(projectId),
  });
  return projectFilter;
}

export async function getFilterById(projectId, filterId) {
  console.log(filterId)
  return Model.findOne({
    _id: ObjectId(filterId),
    // project: ObjectId(projectId),
  }).lean();
}
/************************************************************************
 **************************** UPDATE ************************************
 ************************************************************************/
export async function updateById(filterId, updates, userId) {
  const filterUpdated = await Model.findOneAndUpdate(
    { _id: ObjectId(filterId), creator: ObjectId(userId) },
    updates,
    { new: true, runValidators: true },
  );
  return filterUpdated;
}
/************************************************************************
 **************************** DELETE ************************************
 ************************************************************************/
export async function deleteById(
  FilterId,
  userId,
  options = { session: null },
) {
  const deletedFilter = await Model.findOneAndDelete(
    {
      _id: ObjectId(FilterId),
      creator: ObjectId(userId),
    },
    {
      session: options?.session, // ✅ pass session here
    },
  );

  return deletedFilter;
}

export async function deleteByProject(projectId, deletor, options = {}) {
  if (!projectId) throw new Error("projectId is required");

  if (!deletor) throw new Error("deletor is required");

  return await Model.updateMany(
    { project: ObjectId(projectId) },
    {
      $set: {
        isDeleted: true,
        deletor: ObjectId(deletor),
        deletedAt: new Date(),
      },
    },
    { new: true, session: options.session },
  );
}
