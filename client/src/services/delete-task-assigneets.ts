import { SERVER_URL } from "@/app.constatns";
import { apiFetch } from "@/utils/api-fetch";
import localSpace from "./local-space";

/*******************************************************************
 *********************************** Types *************************
 *******************************************************************/
export type Response = {
  _id: string;
};

export type Payload = {
  user: string;
};

/**
 * using network it fetch the data.
 */
export function deleteTaskAssignee(
  projectId?: string,
  taskId?: string,
  payload?: Payload,
) {
  if (!projectId) throw new Error("projectId is required");
  if (!payload) throw new Error("payload is required");

  return apiFetch<Response, Payload>({
    url: `${SERVER_URL}/api/projects/${projectId}/tasks/${taskId}/assignment`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localSpace.getAccessToken()}`,
    },
    body: payload,
  });
}
