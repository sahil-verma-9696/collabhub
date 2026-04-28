import { SERVER_URL } from "@/app.constatns";
import localSpace from "./local-space";
import { apiFetch } from "@/utils/api-fetch";

export type ActivityUser = {
  _id: string;
  name: string;
  email: string;
};

export type Activity = {
  _id: string;
  project: string;
  user: ActivityUser;
  action: string;
  resourceType: string;
  resourceId: string | null;
  details: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

export default async function getActivities(projectId?: string) {
  if (!projectId) throw new Error("projectId is required");

  const url = new URL(`${SERVER_URL}/api/projects/${projectId}/activities`);

  return apiFetch<Activity[]>({
    url,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localSpace.getAccessToken()}`,
    },
  });
}
