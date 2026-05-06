import React from "react";
import { Card } from "./ui/card";
import { UserListItem } from "./user-list-item";
import {
  getChannelMembers,
  type ChannelMember,
} from "@/services/get-channelMembers";
import { useParams } from "react-router";
import { toast } from "react-toastify";

export const RightSidebar = () => {
  const { projectId, channelId } = useParams();

  const [members, setMembers] = React.useState<ChannelMember[]>([]);

  const [membersLoading, setMembersLoading] = React.useState(false);

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

  const creator = React.useMemo(
    () => members.find((member) => member.addBy == null),
    [members],
  );

  if (membersLoading) return null;
  
  return (
    <div data-slot="right-sidebar">
      <Card className="w-[18rem] h-full rounded-none bg-transparent border-none shadow-none flex flex-col gap-1">
        <h2 className="my-2">Creator</h2>
        <UserListItem className="hover:bg-yellow-100 border border-gray-400 bg-yellow-100" user={creator?.user || {}} />
        <h2 className="my-2">Online - 1</h2>
        <UserListItem className="hover:bg-green-200 border border-gray-400 bg-green-200" user={{}} />
        <h2 className="my-2">Offline - 1</h2>

        {members.map((member) => {
          if (member.addBy == null) return null;
          return <UserListItem className="hover:bg-red-100 border border-gray-400 bg-red-100" key={member._id} user={member.user || {}} />;
        })}
      </Card>
    </div>
  );
};
