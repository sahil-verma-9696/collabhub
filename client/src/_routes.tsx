import { createBrowserRouter, Navigate, type RouteObject } from "react-router";
import { HomePage } from "./pages/home";
import { LandingPage } from "./pages/landing";
import App from "./App";
import { LoginPage } from "./pages/login";
import { PagesPage } from "./pages/page";
import PrivateLayout from "./private.layout";
import { SignupPage } from "./pages/signup";
import { ProfilePage } from "./pages/profile";
import { ChatPage } from "./pages/chat";
import { SettingsPage } from "./pages/settings";
import { DashboardPage } from "./pages/dashboard";

export const workspaceChilds: RouteObject[] = [
  {
    index: true,
    element: <Navigate to=":workspace-name" replace />,
  },
  {
    path: ":id",
    element: <div>Hello</div>,
  },
];

export const protectedChilds: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="home" replace />,
  },
  {
    path: "home",
    element: <HomePage />,
  },
  {
    path: "workspaces",
    element: <DashboardPage />,
    children: workspaceChilds,
  },
  {
    path: "profile",
    element: <ProfilePage />,
  },
  {
    path: "chats/:id",
    element: <ChatPage />,
  },
  {
    path: "pages/:client-id",
    element: <PagesPage />,
  },
  {
    path: "pages",
    element: <PagesPage />,
  },
  {
    path: "settings",
    element: <SettingsPage />,
  },
];

const appChilds: RouteObject[] = [
  {
    index: true,
    element: <LandingPage />,
  },
  {
    path: "/me",
    element: <PrivateLayout />,
    children: protectedChilds,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: appChilds,
  },
]);

export default router;
