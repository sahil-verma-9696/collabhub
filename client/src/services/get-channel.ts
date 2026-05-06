import { SERVER_URL } from "@/app.constatns";
import { apiFetch } from "@/utils/api-fetch";
import localSpace from "./local-space";
import type { Channel } from "./post-channel";

/*******************************************************************
 *********************************** Types *************************
 *******************************************************************/
export type Response = Channel[] | null;

export type Payload = undefined;

/**
 * using network it fetch the data.
 */
export function getChannels(projectId?: string, payload?: Payload) {
  if (!projectId) throw new Error("projectId is required");

  return apiFetch<Response, Payload>({
    url: `${SERVER_URL}/api/projects/${projectId}/channels`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localSpace.getAccessToken()}`,
    },
    body: payload,
  });
}
