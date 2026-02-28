"use client";

import * as React from "react";
import {
  BookOpen,
  ChevronDown,
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
import { Link, useLocation } from "react-router";
import { APP_NAME } from "@/app.constatns";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

const data = {
  navMain: [
    {
      title: "Tasks",
      url: "#",
      icon: ClipboardPlus,
      collapsable: false,
    },
    {
      title: "Pages",
      url: "#",
      icon: BookOpen,
      collapsable: true,
    },
  ],
  navSecondary: [
    {
      title: "Profile",
      url: "/me/profile",
      icon: CircleUser,
    },
    {
      title: "Settings",
      url: "/me/settings",
      icon: Settings,
    },
    {
      title: "Feedback",
      url: "https://github.com/sahil-verma-9696/communication/issues",
      icon: Send,
      targetBlank: true,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const ctx = useGlobalContext();

  const ExcludePaths = ["/me/home"];

  if (ExcludePaths.includes(location.pathname)) {
    return null;
  }
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/me/home">
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
            <Link to="/me/workspaces">
              <SidebarMenuButton className="cursor-pointer">
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenu>
          <SidebarGroup>
            <SidebarGroupLabel>Communication</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuButton>
                <MessageCircle />
                <span>Everyone</span>
              </SidebarMenuButton>

              {[
                { name: "Sahil Verma", role: "Admin", to: "/me/chats/sahil" },
                { name: "Sonal Verma", role: "Write", to: "/me/chats/sonal" },
                { name: "Muskan Gautam", role: "Read", to: "/me/chats/muskan" },
                { name: "Vansh Nigam", role: "Read", to: "/me/chats/vansh" },
                { name: "Sakshi Verma", role: "Read", to: "/me/chats/sakshi" },
                { name: "Atul Verma", role: "Read", to: "/me/chats/atul" },
              ].map((item) => {
                return (
                  <Link key={item.name} to={item.to}>
                    <SidebarMenuButton key={item.name}>
                      <MessageCircle />
                      <span>{item.name}</span>
                      <Badge
                        variant={"outline"}
                        className="border-green-500 text-green-700 bg-green-200 "
                      >
                        Online
                      </Badge>
                    </SidebarMenuButton>
                  </Link>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
          <NavMain items={data.navMain} />

          <SidebarGroup>
            <SidebarGroupLabel className="space-x-4">
              <span>Team members</span>
              <Badge variant={"outline"}>0/6</Badge>
            </SidebarGroupLabel>
            <SidebarMenu>
              {[
                { name: "Sahil Verma", role: "Admin", to: "/me/chats/sahil" },
                { name: "Sonal Verma", role: "Write", to: "/me/chats/sonal" },
                { name: "Muskan Gautam", role: "Read", to: "/me/chats/muskan" },
                { name: "Vansh Nigam", role: "Read", to: "/me/chats/vansh" },
                { name: "Sakshi Verma", role: "Read", to: "/me/chats/sakshi" },
                { name: "Atul Verma", role: "Read", to: "/me/chats/atul" },
              ].map((item) => {
                return (
                  <Link key={item.name} to={item.to}>
                    <SidebarMenuButton className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <User size={18} />
                        <span>{item.name}</span>
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Badge variant="outline">
                            {item.role}
                            <ChevronDown />
                          </Badge>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="space-y-1 p-2">
                          <Button variant={"outline"} className="w-full">
                            Admin
                          </Button>
                          <Button variant={"outline"} className="w-full">
                            Write
                          </Button>
                          <Button variant={"outline"} className="w-full">
                            Read
                          </Button>
                        </PopoverContent>
                      </Popover>
                    </SidebarMenuButton>
                  </Link>
                );
              })}
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
