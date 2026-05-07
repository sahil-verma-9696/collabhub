import {
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  Users,
  Calendar,
  Bell,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePageContext } from "./_context";
import React, { useEffect, useMemo, useState } from "react";
import { Await, Link } from "react-router";
import { useAppContext } from "@/contexts/app.context";
import { useSocketContext } from "@/contexts/socket.context";
import { SOCKET_EVENTS } from "@/socket.events.constants";
import { ROUTES } from "@/_routes.constants";
import getActivities, { type Activity } from "@/services/get-activities";
import getProjectStats, {
  type ProjectDashboardStats,
} from "@/services/get-project-stats";
// import { SidebarProvider } from "@/components/ui/sidebar";

const ACTIVITY_PRIORITY_STYLES: Record<string, string> = {
  urgent: "bg-red-100 text-red-800 border-red-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200",
};

function formatRelativeTime(dateString: string) {
  const createdAt = new Date(dateString).getTime();
  const now = Date.now();
  const diff = now - createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function Page() {
  const ctx = usePageContext();
  const appCtx = useAppContext();
  const { socket } = useSocketContext();

  type DashboardActivity = {
    _id: string;
    title: string;
    description: string;
    time: string;
    user: string;
    priority: string;
    resourceType: string | null;
  };

  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [activityError, setActivityError] = useState<string | null>(null);

  const [projectStats, setProjectStats] =
    useState<ProjectDashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const activityEntries = useMemo<DashboardActivity[]>(
    () =>
      recentActivities.map((activity) => ({
        _id: activity._id,
        title: activity.action,
        description: String(
          (activity.details &&
            (typeof activity.details === "string"
              ? activity.details
              : ((activity.details as Record<string, unknown>).message ??
                JSON.stringify(activity.details)))) ||
            (activity.resourceType
              ? `Updated ${activity.resourceType}`
              : "Project activity"),
        ),
        time: formatRelativeTime(activity.createdAt),
        user: activity.user?.name || "Unknown",
        priority:
          (activity.metadata?.priority as string | undefined) ??
          (activity.action.toLowerCase().includes("delete")
            ? "urgent"
            : "medium"),
        resourceType: activity.resourceType,
      })),
    [recentActivities],
  );

  const activityBadgeClass = (priority: string) => {
    return (
      ACTIVITY_PRIORITY_STYLES[priority] ??
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  useEffect(() => {
    if (!ctx.projectId) return;

    setLoadingActivities(true);
    setActivityError(null);

    getActivities(ctx.projectId)
      .then((activities) => setRecentActivities(activities))
      .catch((error) => {
        setActivityError(
          error instanceof Error ? error.message : String(error),
        );
      })
      .finally(() => setLoadingActivities(false));
  }, [ctx.projectId]);

  useEffect(() => {
    if (!ctx.projectId) return;

    setLoadingStats(true);
    setStatsError(null);

    getProjectStats(ctx.projectId)
      .then((stats) => setProjectStats(stats))
      .catch((error) => {
        setStatsError(error instanceof Error ? error.message : String(error));
      })
      .finally(() => setLoadingStats(false));
  }, [ctx.projectId]);

  useEffect(() => {
    if (!socket || !ctx.projectId) return;

    socket.emit(SOCKET_EVENTS.JOIN_ROOM, ctx.projectId);

    const handleProjectActivity = (activity: Activity) => {
      setRecentActivities((prev) => [activity, ...prev].slice(0, 50));
    };

    const handleProjectStats = (stats: ProjectDashboardStats) => {
      setProjectStats(stats);
    };

    socket.on(SOCKET_EVENTS.PROJECT_ACTIVITY, handleProjectActivity);
    socket.on(SOCKET_EVENTS.PROJECT_STATS, handleProjectStats);

    return () => {
      socket.off(SOCKET_EVENTS.PROJECT_ACTIVITY, handleProjectActivity);
      socket.off(SOCKET_EVENTS.PROJECT_STATS, handleProjectStats);
      socket.emit(SOCKET_EVENTS.LEAVE_ROOM, ctx.projectId);
    };
  }, [socket, ctx.projectId]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "task_completed":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "page_created":
        return <FileText className="w-4 h-4 text-blue-500" />;
      case "task_assigned":
        return <Users className="w-4 h-4 text-purple-500" />;
      case "comment_added":
        return <Bell className="w-4 h-4 text-orange-500" />;
      case "task_overdue":
        return <Clock className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  // const getPriorityColor = (priority: string) => {
  //   switch (priority) {
  //     case "urgent":
  //       return "bg-red-100 text-red-100 border-red-200";
  //     case "high":
  //       return "bg-orange-100 text-orange-800 border-orange-200";
  //     case "medium":
  //       return "bg-yellow-100 text-yellow-800 border-yellow-200";
  //     case "low":
  //       return "bg-green-100 text-green-800 border-green-200";
  //     default:
  //       return "bg-gray-100 text-gray-800 border-gray-200";
  //   }
  // };

  return (
    <ScrollArea className="flex flex-col h-screen">
      <main className="flex-1 p-4 lg:p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-black">
                Welcome back, {ctx.user?.name}!
              </h1>
              <p className="text-white-200">
                {"Here's what's happening with your projects today."}
              </p>
            </div>
            <div className="flex gap-2">
              {/* <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                New Module
              </Button> */}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Channels
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadingStats ? "—" : (projectStats?.totalChannels ?? "—")}
                </div>
                <p className="text-xs text-muted-foreground">
                  {statsError ? "Unable to load stats" : "+2 from yesterday"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Tasks
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadingStats ? "—" : (projectStats?.totalTasks ?? "—")}
                </div>
                <p className="text-xs text-muted-foreground">
                  {statsError ? "Unable to load stats" : "+12 from yesterday"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadingStats ? "—" : (projectStats?.completedTasks ?? "—")}
                </div>
                <p className="text-xs text-muted-foreground">
                  {statsError ? "Unable to load stats" : "+18 from yesterday"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Pages
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadingStats
                    ? "—"
                    : (projectStats?.activePages ?? appCtx.pagesMeta.length)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {statsError ? "Unable to load stats" : "+1 from yesterday"}
                </p>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Team Members
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadingStats ? (
                    "—"
                  ) : projectStats?.totalMembers ? (
                    `${projectStats.totalMembers}/${projectStats.teamLimit}`
                  ) : (
                    <React.Suspense fallback={<div>Loading...</div>}>
                      <Await resolve={appCtx.loaderData.members}>
                        {(members) => {
                          return (
                            <>
                              {members.length}/
                              <React.Suspense fallback={<div>Loading...</div>}>
                                <Await resolve={appCtx.loaderData.project}>
                                  {(project) => <>{project.teamLimit}</>}
                                </Await>
                              </React.Suspense>
                            </>
                          );
                        }}
                      </Await>
                    </React.Suspense>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total team members
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activities */}
            <Card className="h-118 lg:col-span-2">
              <ScrollArea className="h-100 lg:col-span-2">
                <CardHeader className="sticky top-0 bg-white pb-4">
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>
                    Stay updated with the latest changes and updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loadingActivities ? (
                    <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                      Loading project activity...
                    </div>
                  ) : activityError ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                      {activityError}
                    </div>
                  ) : activityEntries.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                      No project activity yet.
                    </div>
                  ) : (
                    activityEntries.map((activity) => (
                      <div
                        key={activity._id}
                        className="flex items-start gap-4 rounded-lg border border-gray-100 bg-white p-4 transition hover:border-gray-200"
                      >
                        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                          {getActivityIcon(
                            activity.resourceType ?? activity.title,
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {activity.title}
                            </p>
                            <Badge
                              variant="outline"
                              className={`text-xs ${activityBadgeClass(activity.priority)}`}
                            >
                              {activity.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-2 truncate">
                            {activity.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <div className="inline-flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage
                                  src="/placeholder.svg?height=16&width=16"
                                  alt={activity.user}
                                />
                                <AvatarFallback>
                                  {activity.user?.charAt(0) ?? "U"}
                                </AvatarFallback>
                              </Avatar>
                              <span>{activity.user}</span>
                            </div>
                            <span>•</span>
                            <span>{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </ScrollArea>
            </Card>

            {/* Quick Actions & Upcoming */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link
                    to={`${ROUTES.PRIVATE.PROJECTS.ROOT}/${ctx.projectId}/${ROUTES.PRIVATE.PROJECTS.TASKS}`}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent cursor-pointer"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Task
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Create New Page
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </Button>
                  <Link
                    to={`${ROUTES.PRIVATE.PROJECTS.ROOT}/${ctx.projectId}/${ROUTES.PRIVATE.PROJECTS.SETTINGS.ROOT}/${ROUTES.PRIVATE.PROJECTS.SETTINGS.ACCESS_CONTROL}`}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent cursor-pointer"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Invite Team Member
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="h-45">
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                </CardHeader>
                <ScrollArea className="h-25">
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Database Migration
                        </p>
                        <p className="text-xs text-gray-500">Due tomorrow</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          User Research Report
                        </p>
                        <p className="text-xs text-gray-500">Due in 2 days</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Design System Review
                        </p>
                        <p className="text-xs text-gray-500">Due in 5 days</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Design System Review
                        </p>
                        <p className="text-xs text-gray-500">Due in 5 days</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Design System Review
                        </p>
                        <p className="text-xs text-gray-500">Due in 5 days</p>
                      </div>
                    </div>
                  </CardContent>
                </ScrollArea>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </ScrollArea>
  );
}
