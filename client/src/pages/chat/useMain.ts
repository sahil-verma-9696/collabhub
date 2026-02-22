import { useSocketContext } from "@/contexts/socket.context";
import useAsyncState from "@/hooks/use-async-state";
import getChat, { type ChatResponse } from "@/services/get-chat";
import getMessages, {
  MESSAGE_STATUS_ENUM,
  type Message,
} from "@/services/get-messages";
import localSpace from "@/services/local-space";
import { messageQueue } from "@/services/message-queue";
import { SOCKET_EVENTS } from "@/socket.events.constants";
import chalk from "chalk";
import React, { useMemo } from "react";
import { useSearchParams } from "react-router";

export const MESSAGE_TYPE = {
  TEXT: "text",
  IMAGE: "image",
  PDF: "pdf",
  LINK: "link",
} as const;

export type MessageType = (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE];

export type MessagePayload = {
  text: string;
  type: MessageType;
  sender: string;
  chat: string;
};

function prepareMessage(payload: MessagePayload): Message {
  return {
    _id: "",
    chat: payload.chat,
    sender: payload.sender,
    type: MESSAGE_TYPE.TEXT,
    text: payload.text,
    readBy: [],
    readAt: null,
    isEdited: false,
    isDeleted: false,
    createdAt: new Date(Date.now()).toISOString(),
    updatedAt: "",
    clientId: crypto.randomUUID(),
    status: MESSAGE_STATUS_ENUM.PENDING,
    __v: 0,
  };
}

export default function useMain() {
  const { socket } = useSocketContext();
  const [searchParams] = useSearchParams();

  const observerRef = React.useRef<IntersectionObserver | null>(null);
  const observedMessages = React.useRef(new Set<string>());

  const userId = searchParams.get("userId");

  const {
    data: chatRes,
    setData: setChatRes,
    error: chatResError,
    setError: setChatResError,
    loading: chatResLoading,
    setLoading: setChatResLoading,
  } = useAsyncState<ChatResponse[]>();

  const [messageHistory, setMessageHistory] = React.useState<Message[]>([]);
  const [messageHistoryError, setMessageHistoryError] = React.useState<
    string | null
  >(null);
  const [messageHistoryLoading, setMessageHistoryLoading] =
    React.useState(false);

  const chatId = useMemo(() => chatRes?.[0]?.chat._id, [chatRes]);

  function listenJoinChat() {
    console.log(chalk.magenta(`[on::${SOCKET_EVENTS.JOIN_CHAT}]`));
  }

  function listenLeaveChat() {
    console.log(chalk.magenta(`[on::${SOCKET_EVENTS.LEAVE_CHAT}]`));
  }

  function listenMessage(data: Message) {
    console.log(chalk.magenta(`[on::${SOCKET_EVENTS.MESSAGE}]`), data);

    setMessageHistory((prev) => [...prev, data]);
  }

  function listenMessageSend(data: Message[]) {
    console.log(chalk.magenta(`[on::${SOCKET_EVENTS.MESSAGE_SEND}]`), data);

    setMessageHistory((prev) => {
      return prev.map((msg) => {
        const updated = data.find((d) => d.clientId === msg.clientId);

        if (
          msg.status === MESSAGE_STATUS_ENUM.DELIVERED ||
          msg.status === MESSAGE_STATUS_ENUM.READ
        )
          return msg;

        return updated
          ? { ...msg, ...updated, status: MESSAGE_STATUS_ENUM.SENT }
          : msg;
      });
    });
  }

  function listenMessageDelivered(data: Message[]) {
    console.log(
      chalk.magenta(`[on::${SOCKET_EVENTS.MESSAGE_DELIVERED}]`),
      data,
    );

    setMessageHistory((prev) => {
      return prev.map((msg) => {
        const updated = data.find((d) => d.clientId === msg.clientId);

        if (msg.status === MESSAGE_STATUS_ENUM.READ) return msg;

        return updated
          ? { ...msg, ...updated, status: MESSAGE_STATUS_ENUM.DELIVERED }
          : msg;
      });
    });
  }

  function listenMessageRead(data: Message[]) {
    console.log(chalk.magenta(`[on::${SOCKET_EVENTS.MESSAGE_READ}]`), data);
    setMessageHistory((prev) => {
      return prev.map((msg) => {
        const updated = data.find((d) => d.clientId === msg.clientId);
        return updated
          ? { ...msg, ...updated, status: MESSAGE_STATUS_ENUM.READ }
          : msg;
      });
    });
  }

  function onSend(messageText: string) {
    const senderId = localSpace.getUser()?._id;

    if (!chatId || !senderId) return;

    const newMessage = prepareMessage({
      text: messageText,
      type: MESSAGE_TYPE.TEXT,
      sender: senderId,
      chat: chatId,
    });

    setMessageHistory([...(messageHistory || []), newMessage]);

    messageQueue.enqueue(newMessage);
  }

  const observeMessage = React.useCallback((node: HTMLElement | null) => {
    if (!node || !observerRef.current) return;

    observerRef.current.observe(node);
  }, []);

  /**
   * Get Chat data of a user
   * -------------------
   */
  React.useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        setChatResLoading(true);
        const res = await getChat(userId);

        setChatRes(res);
        setChatResLoading(false);
      } catch (error) {
        setChatResError((error as Error).message);
        setChatResLoading(false);
      }
    })();
  }, []);

  /**
   * Get Message History of a user's chat via network and message queue
   * ------------------------------------------------------------------
   */
  React.useEffect(() => {
    (async () => {
      try {
        if (chatId) {
          setMessageHistoryLoading(true);
          const res = await getMessages(chatId);

          setMessageHistory([...res, ...messageQueue.getMessages()]);

          setMessageHistoryLoading(false);
        }
      } catch (error) {
        setMessageHistoryError((error as Error).message);
        setMessageHistoryLoading(false);
      }
    })();
  }, [chatId]);

  /**
   * Emit Join & leave chat room.
   * -----------------------
   */
  React.useEffect(() => {
    if (socket && chatId) {
      socket.emit(SOCKET_EVENTS.JOIN_CHAT, chatId);
    }

    return () => {
      if (socket && chatId) {
        socket.emit(SOCKET_EVENTS.LEAVE_CHAT, chatId);
      }
    };
  }, [socket, chatId]);

  /**
   * Listeners
   * ----------------------------------
   */
  React.useEffect(() => {
    if (socket) {
      socket.on(SOCKET_EVENTS.JOIN_CHAT, listenJoinChat);
      socket.on(SOCKET_EVENTS.LEAVE_CHAT, listenLeaveChat);
      socket.on(SOCKET_EVENTS.MESSAGE, listenMessage);
      socket.on(SOCKET_EVENTS.MESSAGE_SEND, listenMessageSend);
      socket.on(SOCKET_EVENTS.MESSAGE_DELIVERED, listenMessageDelivered);
      socket.on(SOCKET_EVENTS.MESSAGE_READ, listenMessageRead);
    }

    return () => {
      if (socket) {
        socket.off(SOCKET_EVENTS.JOIN_CHAT, listenJoinChat);
        socket.off(SOCKET_EVENTS.LEAVE_CHAT, listenLeaveChat);
        socket.off(SOCKET_EVENTS.MESSAGE, listenMessage);
        socket.off(SOCKET_EVENTS.MESSAGE_SEND, listenMessageSend);
        socket.off(SOCKET_EVENTS.MESSAGE_DELIVERED, listenMessageDelivered);
        socket.off(SOCKET_EVENTS.MESSAGE_READ, listenMessageRead);
      }
    };
  }, [socket]);

  React.useEffect(() => {
    if (!socket) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const messageId = entry.target.getAttribute("data-message-id");
          const status = entry.target.getAttribute("data-message-status");
          const senderId = entry.target.getAttribute("data-message-sender");

          if (senderId === localSpace.getUser()?._id) return;

          if (!messageId) return;

          // Already read
          if (status === MESSAGE_STATUS_ENUM.READ) return;

          // Prevent duplicate emits
          if (observedMessages.current.has(messageId)) return;

          observedMessages.current.add(messageId);

          socket.emit(SOCKET_EVENTS.MESSAGE_READ, {
            clientId: messageId,
            senderId: localSpace.getUser()?._id,
          });

          observerRef.current?.unobserve(entry.target);
        });
      },
      {
        threshold: 0.6,
      },
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, [socket]);

  return {
    chatRes,
    chatResError,
    chatResLoading,
    messageHistory,
    messageHistoryError,
    messageHistoryLoading,
    onSend,
    observeMessage,
  };
}
