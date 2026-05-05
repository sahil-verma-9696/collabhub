import { SERVER_URL } from "@/app.constatns";
import localSpace from "./local-space";
import { apiFetch } from "@/utils/api-fetch";

/*******************************************************************
 *********************************** Types *************************
 *******************************************************************/
export type User = {
  accountId: string;
  email: string;
  name: string;
  trialEndAt: number | null;
  userId: string;
  _id: string;
};

/**
 * Get participant chat
 * -----------------------
 *
 * using network it fetch the chat of a user.
 */
export default async function me() {
  return apiFetch<User>({
    url: `${SERVER_URL}/auth/me`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localSpace.getAccessToken()}`,
    },
  });
}
