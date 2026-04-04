import { SERVER_URL } from "@/app.constatns";
import localSpace from "./local-space";
import { apiFetch } from "@/utils/api-fetch";
import type { Page } from "./post-page";

/*******************************************************************
 *********************************** Types *************************
 *******************************************************************/
export type ResPayload = Page;

export type ReqPayload = undefined;

/**
 * getPageMetas
 * -----------------------
 *
 * using network it fetch the chat of a user.
 */
export default async function getPage(projectId: string, pageId: string) {
  return apiFetch<ResPayload, ReqPayload>({
    url: `${SERVER_URL}/api/projects/${projectId}/pages/${pageId}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localSpace.getAccessToken()}`,
    },
  });
}
