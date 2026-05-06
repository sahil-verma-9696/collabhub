import { SERVER_URL } from "@/app.constatns";
import { apiFetch } from "@/utils/api-fetch";
import localSpace from "./local-space";

/*******************************************************************
 *********************************** Types *************************
 *******************************************************************/
export type Response = {
  message: string;
};

export type Payload = undefined;

/**
 * using network it fetch the data.
 */
export function deleteChannel(
  projectId?: string,
  channelId?: string,
  payload?: Payload,
) {
  if (!projectId) throw new Error("projectId is required");
  if (!channelId) throw new Error("channelId is required");

  return apiFetch<Response, Payload>({
    url: `${SERVER_URL}/api/projects/${projectId}/channels/${channelId}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localSpace.getAccessToken()}`,
    },
    body: payload,
  });
}
