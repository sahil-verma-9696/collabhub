import { SERVER_URL } from "@/app.constatns";
import { apiFetch } from "@/utils/api-fetch";

/*******************************************************************
 *********************************** Types *************************
 *******************************************************************/

/**
 * using network it fetch the data.
 */
export default async function deletePage(projectId: string, pageId: string) {
  if (!projectId) throw new Error("projectId is required");

  return apiFetch({
    url: `${SERVER_URL}/api/projects/${projectId}/pages/${pageId}`,
    method: "DELETE",
  });
}
