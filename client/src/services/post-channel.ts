import { SERVER_URL } from "@/app.constatns";
import { apiFetch } from "@/utils/api-fetch";
import localSpace from "./local-space";

/*******************************************************************
 *********************************** Types *************************
 *******************************************************************/
export type Channel = {
  _id: string;

  project: string;
  creator: string;
  name: string;

  createdAt: string;
  updatedAt: string;
};

export type Response = Channel | null;

export type Payload = {
  name: string;
  members: string[] | null;
};

/**
 * using network it fetch the data.
 */
export function postChannel(projectId?: string, payload?: Payload) {
  if (!projectId) throw new Error("projectId is required");
  if (!payload) throw new Error("payload is required");

  return apiFetch<Response, Payload>({
    url: `${SERVER_URL}/api/projects/${projectId}/channels`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${localSpace.getAccessToken()}`,
    },
    body: payload,
  });
}
