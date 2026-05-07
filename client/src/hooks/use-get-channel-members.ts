import {
  getChannelMembers,
  type ChannelMember,
} from "@/services/get-channelMembers";
import React from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";

export function useGetChannelMembers() {
  const { projectId, channelId } = useParams();
  const [members, setMembers] = React.useState<ChannelMember[]>([]);
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

  return { members, membersLoading, setMembers, setMembersLoading };
}
