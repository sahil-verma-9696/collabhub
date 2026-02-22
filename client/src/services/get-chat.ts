import { SERVER_URL } from "@/app.constatns";
import localSpace from "./local-space";
import { apiFetch } from "@/utils/api-fetch";
import type { User } from "./auth";
/*******************************************************************
 *********************************** Types *************************
 *******************************************************************/

export const CHAT_TYPE = {
  DIRECT: "direct",
  GROUP: "group",
} as const;

export type Chat = {
  _id: string;
  type: (typeof CHAT_TYPE)[keyof typeof CHAT_TYPE];
  name: string | null;
  description: string | null;
  avatar: string | null;
  lastMessage: string | null;
  creator: string;
  unreadCount: number;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Participant = {
  _id: string;
  chat: string;
  user: User;
  role: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export interface ChatResponse {
  _id: string;
  chat: Chat;
  participant: Participant;
}

/**
 * Get participant chat
 * -----------------------
 *
 * using network it fetch the chat of a user.
 */
export default async function getChat(participantId: string) {
  return apiFetch<ChatResponse[]>({
    url: `${SERVER_URL}/chats?participant=${participantId}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localSpace.getAccessToken()}`,
    },
  });
}
