import { SERVER_URL } from "@/app.constatns";
import localSpace from "./local-space";
import { apiFetch } from "@/utils/api-fetch";
import { MESSAGE_TYPE } from "@/pages/chat/useMain";
/*******************************************************************
 *********************************** Types *************************
 *******************************************************************/

export const MESSAGE_STATUS_ENUM = {
  SENT: "sent",
  DELIVERED: "delivered",
  READ: "read",
  PENDING: "pending",
} as const;

export type MESSAGE_STATUS =
  (typeof MESSAGE_STATUS_ENUM)[keyof typeof MESSAGE_STATUS_ENUM];

export type Message = {
  _id: string;
  chat: string;
  sender: string;
  type: (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE];
  text?: string;
  readBy: [];
  readAt: null;
  isEdited: false;
  isDeleted: false;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  status: MESSAGE_STATUS;
  __v: number;
};

/**
 * Get Messages of a user's chat
 * -----------------------
 *
 * using network it fetch the friends of a user.
 */
export default async function getMessages(chatId: string) {
  return apiFetch<Message[]>({
    url: `${SERVER_URL}/messages?chatId=${chatId}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localSpace.getAccessToken()}`,
    },
  });
}
