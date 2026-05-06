import { ResultList } from "@/components/result-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserListItem } from "@/components/user-list-item";
import { ShieldAlert } from "lucide-react";
import React from "react";
import { useAccessControlPage } from "./useAccessControlPage";
import { APP_NAME } from "@/app.constatns";
import { Await } from "react-router-dom";
import type { Invite } from "@/services/get-invites";
import { Badge } from "@/components/ui/badge";
import { usePageContext } from "./_context";
import type { Member } from "@/services/get-members";
import { ScrollArea } from "@/components/ui/scroll-area";

export const PROJECT_ROLE = {
  OWNER: "owner",
  ADMIN: "admin",
  WRITE: "write",
  READ: "read",
  OTHERS: "others",
} as const;

export default function Page() {
  const role: (typeof PROJECT_ROLE)[keyof typeof PROJECT_ROLE] =
    PROJECT_ROLE.OWNER;
  const ctx = useAccessControlPage();
  const { users, usersLoading } = ctx;

  if (role !== PROJECT_ROLE.OWNER && role !== PROJECT_ROLE.ADMIN) {
    return (
      <div className="flex min-h-full items-center justify-center bg-muted/40 p-6">
        <Card className="max-w-md w-full shadow-lg border">
          <CardContent className="flex flex-col items-center text-center p-8 space-y-4">
            <div className="p-4 rounded-full bg-red-100 text-red-600">
              <ShieldAlert className="h-10 w-10" />
            </div>

            <h1 className="text-2xl font-semibold">Access Restricted</h1>

            <p className="text-muted-foreground text-sm">
              You don't have permission to view this page.
            </p>

            <p className="text-sm font-medium text-red-500">
              Only Owner or Admin are allowed to access this resource.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-4">
      <h3 className="text-2xl pt-4 font-semibold">Invite Members</h3>
      <React.Fragment>
        <div className="flex gap-2">
          <Input
            placeholder="Search by email"
            value={ctx.query}
            onChange={ctx.handleInputChange}
          />
          <Select onValueChange={ctx.handleRoleChange} defaultValue={ctx.role}>
            <SelectTrigger className="w-full max-w-48">
              <SelectValue placeholder="Select a Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Roles</SelectLabel>
                {Object.values(PROJECT_ROLE)
                  .filter(
                    (r) =>
                      r !== PROJECT_ROLE.OTHERS && r !== PROJECT_ROLE.OWNER,
                  )
                  .map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            variant={"outline"}
            className="bg-green-400 text-white border border-green-600 hover:bg-green-500 hover:text-whtie font-bold"
            onClick={ctx.handleInviteClick}
            disabled={!ctx.query.length}
          >
            Invite
          </Button>
        </div>

        <ResultList show={ctx.query.length > 0}>
          <ResultList.Loading loading={usersLoading}>
            Loading...
          </ResultList.Loading>

          <ResultList.Empty
            show={!users.length && ctx.query.length > 0 && !usersLoading}
            className="flex flex-col items-center"
          >
            <Button
              onClick={ctx.handleNewUserInviteClick}
              variant={"link"}
              className=" text-green-400  font-bold"
            >
              Invite new "{ctx.query}@gmail.com" to {APP_NAME}
            </Button>
            <div>No users found</div>
          </ResultList.Empty>

          {users.map((user) => (
            <ResultList.Item key={user._id}>
              <UserListItem onClick={ctx.onClickUser(user)} user={user} />
            </ResultList.Item>
          ))}
        </ResultList>
      </React.Fragment>

      {/* Invites */}
      <React.Suspense fallback={<p>Loading invites...</p>}>
        <Await resolve={ctx.loaderData.invites}>{ShowInvites}</Await>
      </React.Suspense>

      {/* Members */}
      <React.Suspense fallback={<p>Loading members...</p>}>
        <Await resolve={ctx.loaderData.members}>{ShowMembers(ctx)}</Await>
      </React.Suspense>
    </div>
  );
}

Page.displayName = "AccessControlPage";

function ShowInvites(invites: Invite[]) {
  const ctx = usePageContext();

  const mergeInvites: Invite[] = [...ctx.invites, ...invites];

  if (invites.length === 0) return null;
  return (
    <>
      <h3 className="text-2xl pt-4 font-semibold">Pending Invites</h3>
      <ScrollArea className="h-50 space-y-4">
        {mergeInvites.map((invite) => {
          return (
            <UserListItem
              key={invite._id}
              uid={invite._id}
              user={{
                email: invite.email,
              }}
              lslot={
                <div className="flex gap-1">
                  <Badge>{invite.role}</Badge>
                  <Badge>{invite.status}</Badge>
                </div>
              }
            />
          );
        })}
      </ScrollArea>
    </>
  );
}

function ShowMembers(ctx: ReturnType<typeof useAccessControlPage>) {
  return (members: Member[]) => {
    if (members.length === 0) return null;
    return (
      <>
        <h3 className="text-2xl pt-4 font-semibold">Project Members</h3>
        <ScrollArea>
          {members.map((member) => {
            if (member.role == PROJECT_ROLE.OWNER)
              return (
                <UserListItem
                  key={member._id}
                  uid={member._id}
                  user={member.user}
                  lslot={
                    <div className="flex gap-1">
                      <div className="px-4 py-2 rounded capitalize font-extrabold text-amber-500 border border-amber-500 bg-yellow-100 text-center ">
                        {member.role}
                      </div>
                    </div>
                  }
                />
              );
            return (
              <UserListItem
                key={member._id}
                uid={member._id}
                user={member.user}
                lslot={
                  <div className="flex gap-1">
                    <Select
                      onValueChange={ctx.handleUpdateMemberRole(member._id)}
                      defaultValue={member.role}
                    >
                      <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Select a Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Roles</SelectLabel>
                          {Object.values(PROJECT_ROLE)
                            .filter(
                              (r) =>
                                r !== PROJECT_ROLE.OTHERS &&
                                r !== PROJECT_ROLE.OWNER,
                            )
                            .map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button
                      disabled={ctx.removeLoading}
                      onClick={ctx.handleRemoveMember(member._id)}
                      variant={"destructive"}
                    >
                      Remove
                    </Button>
                  </div>
                }
              />
            );
          })}
        </ScrollArea>
      </>
    );
  };
}
