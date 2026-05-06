"use client";

import * as React from "react";
import {
  BookOpen,
  CircleUser,
  ClipboardPlus,
  LayoutDashboard,
  // Command,
  // LifeBuoy,
  MessageCircle,
  Send,
  Settings,
  User,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useGlobalContext } from "@/contexts/global.context";
import { Await, Link, useParams } from "react-router";
import { APP_NAME } from "@/app.constatns";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { ROUTES } from "@/_routes.constants";
import { useAppContext } from "@/contexts/app.context";
import { PROJECT_ROLE } from "@/pages/settings/access-control.page";

const data = {
  navMain: [
    {
      title: "Tasks",
      url: ROUTES.PRIVATE.PROJECTS.TASKS,
      icon: ClipboardPlus,
      collapsable: false,
    },
    {
      title: "Pages",
      url: ROUTES.PRIVATE.PROJECTS.PAGES,
      icon: BookOpen,
      collapsable: true,
    },
  ],
  navSecondary: [
    {
      title: "Profile",
      url: ROUTES.PRIVATE.PROJECTS.PROFILE,
      icon: CircleUser,
    },
    {
      title: "Settings",
      url: `${ROUTES.PRIVATE.PROJECTS.SETTINGS.ROOT}/${ROUTES.PRIVATE.PROJECTS.SETTINGS.GENERAL}`,
      icon: Settings,
    },
    {
      title: "Feedback",
      url: "https://github.com/sahil-verma-9696/collabhub/issues",
      icon: Send,
      targetBlank: true,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const ctx = useGlobalContext();
  const { projectId } = useParams();
  const appCtx = useAppContext();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={`${ROUTES.PRIVATE.PROJECTS.ROOT}`}>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  {/* <Command className="size-4" /> */}
                  <span className="font-bold">CH</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{APP_NAME}</span>
                  {/* <span className="truncate text-xs">Project</span> */}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-full w-full rounded-md">
          <SidebarMenu className="p-2">
            <Link
              to={`${ROUTES.PRIVATE.PROJECTS.ROOT}/${projectId}/${ROUTES.PRIVATE.PROJECTS.DASHBOARD}`}
            >
              <SidebarMenuButton className="cursor-pointer">
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </Link>
            <Link
              to={`${ROUTES.PRIVATE.PROJECTS.ROOT}/${projectId}/${ROUTES.PRIVATE.PROJECTS.COMMUNICATIONS}`}
            >
              <SidebarMenuButton className="cursor-pointer">
                <MessageCircle />
                <span>Communication</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenu>

          <NavMain items={data.navMain} />

          <SidebarGroup>
            <SidebarMenu>
              <React.Suspense fallback={<div>Loading...</div>}>
                <Await resolve={appCtx.loaderData.members}>
                  {(members) => {
                    return (
                      <>
                        <SidebarGroupLabel className="space-x-4">
                          <span>Team members</span>
                          <Badge variant={"outline"}>
                            {members.length}/
                            <React.Suspense fallback={<div>Loading...</div>}>
                              <Await resolve={appCtx.loaderData.project}>
                                {(project) => <span>{project.teamLimit}</span>}
                              </Await>
                            </React.Suspense>
                          </Badge>
                        </SidebarGroupLabel>
                        {members.map((member) => (
                          <SidebarMenuButton
                            key={member._id}
                            className="flex justify-between"
                          >
                            <div className="flex items-center gap-2 text-zinc-500">
                              <User size={18} />
                              {member.role == PROJECT_ROLE.OWNER && (
                                <Badge variant="outline" className="w-14 border-amber-500 bg-yellow-100">
                                  {member.role}
                                </Badge>
                              )}
                              {member.role == PROJECT_ROLE.ADMIN && (
                                <Badge variant="outline" className="w-14 border-violet-500 bg-purple-100">
                                  {member.role}
                                </Badge>
                              )}
                              {member.role == PROJECT_ROLE.WRITE && (
                                <Badge variant="outline" className="w-14 border-blue-500 bg-blue-100">
                                  {member.role}
                                </Badge>
                              )}
                              {member.role == PROJECT_ROLE.READ && (
                                <Badge variant="outline" className="w-14 bg-gray-100">
                                  {member.role}
                                </Badge>
                              )}
                              <span>{member.user.email}</span>
                            </div>
                          </SidebarMenuButton>
                        ))}
                      </>
                    );
                  }}
                </Await>
              </React.Suspense>
            </SidebarMenu>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
        <NavUser user={ctx.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
