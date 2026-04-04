/**
 * Repository
 * Handles all database operations
 * Based on ER Diagram Schema
 */

import Model from "../models/PageMetaSchema.js";
import { ObjectId } from "../utils/ObjectId.js";
import { handleMongoDbErrors } from "../utils/handleMongoDBError.js";

/************************************************************************
 **************************** CREATE ************************************
 ************************************************************************/
export async function create(payload, options = {}) {
  const doc = new Model({
    ...payload,
    creator: ObjectId(payload.creator),
    project: ObjectId(payload.project),
    page: ObjectId(payload.page),
  });

  return await handleMongoDbErrors(() => doc.save(options));
}
/************************************************************************
 **************************** READ **************************************
 ************************************************************************/
export async function getById(id, options = { session: null }) {
  if (!id) throw new Error("_id of page is required");

  return await Model.findOne({ _id: id, isDeleted: false }).session(
    options.session,
  );
}

export async function getByProjectId(projectId) {
  if (!projectId) throw new Error("projectId is required");

  return await Model.find({ project: ObjectId(projectId), isDeleted: false });
}
/************************************************************************
 **************************** UPDATE ************************************
 ************************************************************************/
/************************************************************************
 **************************** DELETE ************************************
 ************************************************************************/
export async function softDeleteById(id, deletor, options = {}) {
  if (!id) throw new Error("Page ID is required");

  if (!deletor) throw new Error("deletor is required");

  return await Model.updateOne(
    { _id: id },
    {
      $set: {
        isDeleted: true,
        deletor: ObjectId(deletor),
        deletedAt: new Date(),
      },
    },
    options,
  );
}
