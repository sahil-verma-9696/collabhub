import { ObjectId } from "./ObjectId.js";
import Channel from "../models/ChannelSchema.js";
import Task from "../models/TaskSchema.js";
import PageMeta from "../models/PageMetaSchema.js";
import ProjectMember from "../models/ProjectMemberSchema.js";
import TaskFilterValue from "../models/TaskFilterValueSchema.js";
import ProjectRepo from "../repos/ProjectRepo.js";

export async function getProjectStats(projectId) {
  if (!projectId) throw new Error("projectId is required");

  const projectObjectId = ObjectId(projectId);
  const project = await ProjectRepo.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  const [
    totalChannels,
    totalTasks,
    activePages,
    memberCount,
    completedTasksRes,
  ] = await Promise.all([
    Channel.countDocuments({ project: projectObjectId }),
    Task.countDocuments({ project: projectObjectId }),
    PageMeta.countDocuments({ project: projectObjectId, isDeleted: false }),
    ProjectMember.countDocuments({
      project: projectObjectId,
      isDeleted: false,
    }),
    TaskFilterValue.aggregate([
      {
        $lookup: {
          from: "filtervalues",
          localField: "filterValue",
          foreignField: "_id",
          as: "filterValueDoc",
        },
      },
      { $unwind: "$filterValueDoc" },
      {
        $lookup: {
          from: "filters",
          localField: "filterValueDoc.filter",
          foreignField: "_id",
          as: "filterDoc",
        },
      },
      { $unwind: "$filterDoc" },
      {
        $lookup: {
          from: "tasks",
          localField: "task",
          foreignField: "_id",
          as: "taskDoc",
        },
      },
      { $unwind: "$taskDoc" },
      {
        $match: {
          "taskDoc.project": projectObjectId,
          "filterValueDoc.name": "Done",
          "filterDoc.name": "Status",
        },
      },
      {
        $group: {
          _id: "$task",
        },
      },
      {
        $count: "count",
      },
    ]),
  ]);

  const completedTasks = completedTasksRes?.[0]?.count ?? 0;

  return {
    totalChannels,
    totalTasks,
    completedTasks,
    activePages,
    totalMembers: memberCount + 1,
    teamLimit: project.teamLimit,
  };
}
