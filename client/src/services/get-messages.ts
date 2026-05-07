import { SERVER_URL } from "@/app.constatns";
import { apiFetch } from "@/utils/api-fetch";
import localSpace from "./local-space";

/*******************************************************************
 *********************************** Types *************************
 *******************************************************************/

export type Message = {
  _id: string;
  channel: string;
  content: string;
  sender: string;
  mediaUri: string;
  createdAt: string;
  updatedAt: string;
};

export type Response = Message[] | null;

export type Payload = undefined;

/**
 * using network it fetch the data.
 */
export function getMessages(
  projectId?: string,
  channelId?: string,
  payload?: Payload,
) {
  if (!projectId) throw new Error("projectId is required");
  if (!channelId) throw new Error("channelId is required");

  return apiFetch<Response, Payload>({
    url: `${SERVER_URL}/api/projects/${projectId}/channels/${channelId}/messages`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localSpace.getAccessToken()}`,
    },
    body: payload,
  });
}
