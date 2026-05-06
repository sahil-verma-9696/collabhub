import { SERVER_URL } from "@/app.constatns";
import { apiFetch } from "@/utils/api-fetch";
import localSpace from "./local-space";
import type { User } from "./get-me";

/*******************************************************************
 *********************************** Types *************************
 *******************************************************************/
export type ChannelMember = {
  _id: string | null;
  channel: string;
  user: User;
  addBy: User | null;
};

export type Response = ChannelMember[] | null;

export type Payload = undefined;

/**
 * using network it fetch the data.
 */
export function getChannelMembers(
  projectId?: string,
  channelId?: string,
  payload?: Payload,
) {
  if (!projectId) throw new Error("projectId is required");
  if (!channelId) throw new Error("channelId is required");

  return apiFetch<Response, Payload>({
    url: `${SERVER_URL}/api/projects/${projectId}/channels/${channelId}/members`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localSpace.getAccessToken()}`,
    },
    body: payload,
  });
}
