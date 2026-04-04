import * as filterRepo from "../repos/FilterRepo.js";
import * as filterValueRepo from "../repos/FilterValueRepo.js";

export async function createDefaultFiltersAndValue(projectId, userId) {
  if (!projectId) throw new Error("projectId is required");
  if (!userId) throw new Error("userId is required");

  const data = [
    {
      name: "Status",
      description: "Filter task by status",
      values: [
        {
          name: "In Progress",
          description: "Task in progress",
          color: "#FFFF00",
        },
        {
          name: "Done",
          description: "Task done",
          color: "#00FF00",
        },
        {
          name: "Backlog",
          description: "This item hasn't been started",
          color: "#FF00FF",
        },
      ],
    },
    {
      name: "Priority",
      description: "Filter task by priority",
      values: [
        {
          name: "High",
          description: "High priority task",
          color: "#FF0000",
        },
        {
          name: "Medium",
          description: "Medium priority task",
          color: "#FFFF00",
        },
        {
          name: "Low",
          description: "Low priority task",
          color: "#00FF00",
        },
      ],
    },
    {
      name: "Size",
      description: "Filter task by size",
      values: [
        {
          name: "Small",
          description: "Small task",
          color: "#FF0000",
        },
        {
          name: "Medium",
          description: "Medium task",
          color: "#FFFF00",
        },
        {
          name: "Large",
          description: "Large task",
          color: "#00FF00",
        },
      ],
    },
  ];

  for (let filter of data) {
    const filterCreated = await filterRepo.create(projectId, filter, userId);

    // for each filter create values
    for (let value of filter.values) {
      await filterValueRepo.createFilterValue(value, filterCreated._id, userId);
    }
  }

  console.log(data);
}
