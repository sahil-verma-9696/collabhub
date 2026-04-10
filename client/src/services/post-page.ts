import localSpace from "./local-space";
import { SERVER_URL } from "@/app.constatns";
import { apiFetch } from "@/utils/api-fetch";

/*******************************************************************
 ***************************** Types *******************************
 *******************************************************************/

export type Page = {
  _id: string;
  content: string | null;
  isDeleted: boolean;
  deletor: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: 0;
};

export type PageMeta = {
  _id: string;
  title: string;
  page: string;
  project: string;
  creator: string;
  isDeleted: boolean;
  deletor: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: 0;
};

export type ReqPayload = {
  meta: Partial<PageMeta> & Pick<PageMeta, "title">;
  page: Partial<Page> & Pick<Page, "content">;
};

export type ResPayload = {
  meta: PageMeta;
  page: Page;
};

/**
 * using network it fetch the data.
 */
export default async function postPage(projectId: string, payload: ReqPayload) {
  if (!projectId) throw new Error("projectId is required");

  if (!payload) throw new Error("payload is required");

  return apiFetch<ResPayload, ReqPayload>({
    url: `${SERVER_URL}/api/projects/${projectId}/pages`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${localSpace.getAccessToken()}`,
    },
    body: payload,
  });
}
