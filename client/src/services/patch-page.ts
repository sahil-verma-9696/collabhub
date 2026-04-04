import localSpace from "./local-space";
import { SERVER_URL } from "@/app.constatns";
import { apiFetch } from "@/utils/api-fetch";
import type { Page, PageMeta } from "./post-page";

/*******************************************************************
 ***************************** Types *******************************
 *******************************************************************/
export type ReqPayload = {
  meta: Partial<PageMeta>;
  page: Partial<Page>;
};

export type ResPayload = {
  meta: PageMeta;
  page: Page;
};

/**
 * using network it fetch the data.
 */
export default async function patchPage(
  projectId: string,
  pageId: string,
  payload: ReqPayload,
) {
  if (!projectId) throw new Error("projectId is required");

  if (!pageId) throw new Error("pageId is required");

  return apiFetch<ResPayload, ReqPayload>({
    url: `${SERVER_URL}/api/projects/${projectId}/pages/${pageId}`,
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localSpace.getAccessToken()}`,
    },
    body: payload,
  });
}
