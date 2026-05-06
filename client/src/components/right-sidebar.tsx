import React from "react";
import { Card } from "./ui/card";
import { UserListItem } from "./user-list-item";
import {
  getChannelMembers,
  type ChannelMember,
} from "@/services/get-channelMembers";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { useSocketContext } from "@/contexts/socket.context";
import localSpace from "@/services/local-space";

export const RightSidebar = () => {
  const { projectId, channelId } = useParams();
  const { socket } = useSocketContext();

  const [members, setMembers] = React.useState<ChannelMember[]>([]);
  const [activeUserIds, setActiveUserIds] = React.useState<string[]>([]);

  const [membersLoading, setMembersLoading] = React.useState(false);

  // get channel members
  React.useEffect(() => {
    (async function () {
      if (!projectId || !channelId) return;

      try {
        setMembersLoading(true);
        const res = await getChannelMembers(projectId, channelId);

        setMembers((res as ChannelMember[]) || []);
        setMembersLoading(false);
      } catch (error) {
        toast.error((error as Error).message);
        setMembersLoading(false);
      }
    })();
  }, [projectId, channelId]);

  // listen to socket
  React.useEffect(() => {
    if (!channelId || !socket) return () => {};

    socket.on("user-joined-channel", listenUserJoinedChannel(setActiveUserIds));
    socket.on("get-active-users", listenGetActiveUsers(setActiveUserIds));
    socket.on("user-leave-channel", listenUserLeaveChannel(setActiveUserIds));

    return () => {
      socket.off(
        "user-joined-channel",
        listenUserJoinedChannel(setActiveUserIds),
      );
      socket.off("get-active-users", listenGetActiveUsers(setActiveUserIds));
      socket.off(
        "user-leave-channel",
        listenUserLeaveChannel(setActiveUserIds),
      );
    };
  }, [channelId, socket]);

  const creator = React.useMemo(
    () => members.find((member) => member.addBy == null),
    [members],
  );

  const activeUsers = React.useMemo(
    () =>
      members.filter(
        (member) =>
          activeUserIds.includes(member.user._id) &&
          member.user._id !== localSpace.getUser()?._id,
      ),
    [members, activeUserIds],
  );

  const offlineUsers = React.useMemo(
    () =>
      members.filter(
        (member) =>
          !activeUserIds.includes(member.user._id) &&
          member.user._id !== localSpace.getUser()?._id,
      ),
    [members, activeUserIds],
  );

  if (membersLoading)
    return (
      <div data-slot="right-sidebar">
        <Card className="w-[18rem] h-full rounded-none bg-transparent border-none shadow-none flex flex-col gap-1">
          <div className="w-full h-full  bg-gray-200 rounded-2xl animate-pulse" />
        </Card>
      </div>
    );

  return (
    <div data-slot="right-sidebar">
      <Card className="w-[18rem] h-full rounded-none bg-transparent border-none shadow-none flex flex-col gap-1">
        <h2 className="my-2">Creator</h2>
        <UserListItem
          className="hover:bg-yellow-100 border border-gray-400 bg-yellow-100"
          user={creator?.user || {}}
        />
        <h2 className="my-2">Online - {activeUsers.length || 0}</h2>
        {activeUsers.map((member) => {
          if (member.user._id === localSpace.getUser()?._id) return null;
          return (
            <UserListItem
              className="hover:bg-green-100 border border-green-400 bg-green-200"
              key={member._id}
              user={member.user || {}}
            />
          );
        })}
        <h2 className="my-2">Offline - {offlineUsers.length || 0}</h2>

        {offlineUsers.map((member) => {
          if (member.addBy == null) return null;
          return (
            <UserListItem
              className="hover:bg-red-100 border border-gray-400 bg-red-100"
              key={member._id}
              user={member.user || {}}
            />
          );
        })}
      </Card>
    </div>
  );
};

function listenUserJoinedChannel(
  setActiveUserIds: React.Dispatch<React.SetStateAction<string[]>>,
) {
  return ({ activeUsers }: { activeUsers: Record<string, string[]> }) => {
    console.log("user-joined-channel", Object.keys(activeUsers));
    setActiveUserIds(Object.keys(activeUsers));
  };
}

function listenUserLeaveChannel(
  setActiveUserIds: React.Dispatch<React.SetStateAction<string[]>>,
) {
  return ({ activeUsers }: { activeUsers: Record<string, string[]> }) => {
    console.log("user-joined-channel", Object.keys(activeUsers));
    setActiveUserIds(Object.keys(activeUsers));
  };
}

function listenGetActiveUsers(
  setActiveUserIds: React.Dispatch<React.SetStateAction<string[]>>,
) {
  return ({ activeUsers }: { activeUsers: Record<string, string[]> }) => {
    console.log("user-joined-channel", Object.keys(activeUsers));
    setActiveUserIds(Object.keys(activeUsers));
  };
}
