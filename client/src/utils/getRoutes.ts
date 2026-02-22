import { workspaceChilds } from "@/_routes";

export function getFriendChildrenRoutes(): string[] {
  return workspaceChilds.filter((c) => !!c.path).map((child) => child.path!);
}
