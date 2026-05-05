import Task from "../models/TaskSchema.js";
import { ObjectId } from "../utils/ObjectId.js";
import { handleMongoDbErrors } from "../utils/handleMongoDBError.js";

/************************************************************************
 **************************** CREATE ************************************
 ************************************************************************/
export async function createTask(payload, projectId, userId, options = {}) {
  const doc = new Task({
    ...payload,
    project: ObjectId(projectId),
    creator: ObjectId(userId),
  });
  return await handleMongoDbErrors(() => doc.save(options));
}

/************************************************************************
 **************************** READ **************************************
 ************************************************************************/

export async function getTasksByProject(projectId) {
  const ProjectTasks = await Task.find({
    project: ObjectId(projectId),
  });
  return ProjectTasks;
}

export async function getTaskByTitle(title, userId) {
  return await Task.find({
    title: title,
    creator: ObjectId(userId),
  });
}

export async function queryTasks(projectId, taskFields = {}, filter = null) {
  const pipeline = [];

  pipeline.push({
    $match: {
      project: ObjectId(projectId),
      ...taskFields,
    },
  });

  // Join ALL filter values (not just matched)
  pipeline.push({
    $lookup: {
      from: "taskfiltervalues",
      localField: "_id",
      foreignField: "task",
      as: "tfv",
    },
  });

  // Joining the assignee
  pipeline.push({
    $lookup: {
      from: "taskassignments",
      localField: "_id",
      foreignField: "task",
      as: "assignees",
    },
  });

  pipeline.push({
    $lookup: {
      from: "filtervalues",
      localField: "tfv.filterValue",
      foreignField: "_id",
      as: "fv",
    },
  });

  // Optional filtering (by filterId)
  if (filter) {
    pipeline.push({
      $match: {
        "fv.filter": ObjectId(filter),
      },
    });
  }

  // 🔥 Transform into clean structure
  pipeline.push({
    $addFields: {
      filters: {
        $map: {
          input: "$fv",
          as: "f",
          in: {
            filterId: "$$f.filter",
            valueId: "$$f._id",
            valueName: "$$f.name",
            color: "$$f.color",
          },
        },
      },
    },
  });

  // ❌ remove raw fields
  pipeline.push({
    $project: {
      tfv: 0,
      fv: 0,
    },
  });

  return await Task.aggregate(pipeline);
}

/************************************************************************
 **************************** UPDATE ************************************
 ************************************************************************/

export async function updateTask(taskId, userId, updates) {
  const updatedTask = await Task.findOneAndUpdate(
    { _id: ObjectId(taskId), creator: ObjectId(userId) },
    updates,
    { new: true, runValidators: true },
  );
  return updatedTask;
}

/************************************************************************
 **************************** DELETE ************************************
 ************************************************************************/

export async function deleteTask(taskId, userId) {
  const deletedTask = await Task.findOneAndDelete({
    _id: taskId,
    creator: ObjectId(userId),
  });
  return deletedTask;
}
