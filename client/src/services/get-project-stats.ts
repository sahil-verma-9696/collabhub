import { SERVER_URL } from "@/app.constatns";
import { apiFetch } from "@/utils/api-fetch";

export type ProjectDashboardStats = {
  totalChannels: number;
  totalTasks: number;
  completedTasks: number;
  activePages: number;
  totalMembers: number;
  teamLimit: number;
};

export default async function getProjectStats(projectId?: string) {
  if (!projectId) throw new Error("projectId is required");

  const url = new URL(`${SERVER_URL}/api/projects/${projectId}/stats`);

  return apiFetch<ProjectDashboardStats>({
    url,
    method: "GET",
  });
}
