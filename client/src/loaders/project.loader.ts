import getProject, { type Project } from "@/services/get-project";
import { type LoaderFunction } from "react-router";
import getMembers, { type Member } from "@/services/get-members";

export const projectLoader: LoaderFunction = async ({ params }) => {
  const projectId = params.projectId;

  if (!projectId) throw new Error("projectId is required");

  const project = await getProject(projectId);

  const members = await getMembers(projectId);

  return { project, members };
};

export type LoaderData = {
  project: Promise<Project>;
  members: Promise<Member[]>;
};
