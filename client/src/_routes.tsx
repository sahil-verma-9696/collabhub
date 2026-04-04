import App from "./App";
import PrivateLayout from "./private.layout";
import { createBrowserRouter, Navigate } from "react-router";
import { HomePage } from "./pages/home";
import { LandingPage } from "./pages/landing";
import { LoginPage } from "./pages/login";
import { PagesPage } from "./pages/page";
import { SignupPage } from "./pages/signup";
import { ProfilePage } from "./pages/profile";
import { ChattingPage, CommunicationPage } from "./pages/communication";
import {
  AccessControlPage,
  GeneralSettingPage,
  SettingsPage,
} from "./pages/settings";
import { DashboardPage } from "./pages/dashboard";
import { ROUTES } from "./_routes.constants";
import { InvitePage } from "./pages/invite";
import { ErrorPage } from "./components/error.page";
import { authLoader } from "./loaders/auth.loader";
import { accessControllerLoader } from "./loaders/access-controler.loader";
import { rootLoader } from "./loaders/root.loader";
import { inviteLoader } from "./loaders/invite.loader";
import PublicLayout from "./public.layout";
import { projectLoader } from "./loaders/project.loader";
import { projectsLoader } from "./loaders/projects.loader";
import AppLayout from "./app.layout";
import FilterSettingPage from "./pages/settings/filter.page";
import { TaskPage } from "./pages/task";

// Client-side timing middleware

const router = createBrowserRouter([
  {
    path: "/",
    loader: rootLoader,
    errorElement: <ErrorPage />,
    element: <App />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            path: ROUTES.PUBLIC.ROOT,
            element: <LandingPage />,
          },
          {
            path: ROUTES.PUBLIC.LOGIN,
            loader: authLoader,
            element: <LoginPage />,
          },
          {
            path: ROUTES.PUBLIC.SIGNUP,
            element: <SignupPage />,
          },
          {
            path: ROUTES.PUBLIC.INVITE,
            loader: inviteLoader,
            element: <InvitePage />,
          },
          {
            id: ROUTES.PRIVATE.PROJECTS.ROOT,
            path: ROUTES.PRIVATE.PROJECTS.ROOT,
            loader: projectsLoader,
            element: <PrivateLayout />,
            children: [
              {
                index: true,
                element: <HomePage />,
              },
              {
                id: "project",
                path: ":projectId",
                loader: projectLoader,
                element: <AppLayout />,
                children: [
                  {
                    index: true,
                    element: <DashboardPage />,
                  },
                  {
                    path: ROUTES.PRIVATE.PROJECTS.DASHBOARD,
                    element: <DashboardPage />,
                  },
                  {
                    path: ROUTES.PRIVATE.PROJECTS.PROFILE,
                    element: <ProfilePage />,
                  },
                  {
                    path: ROUTES.PRIVATE.PROJECTS.COMMUNICATIONS,
                    children: [
                      {
                        index: true,
                        element: <CommunicationPage />,
                      },
                      {
                        path: ":chatId",
                        element: <ChattingPage />,
                      },
                    ],
                  },
                  {
                    path: ROUTES.PRIVATE.PROJECTS.PAGES,
                    element: <PagesPage />,
                    children: [
                      {
                        index: true,
                        element: <Navigate to=":pageId" replace />,
                      },
                      {
                        path: ":pageId",
                        element: <PagesPage />,
                      },
                    ],
                  },
                  {
                    path: ROUTES.PRIVATE.PROJECTS.TASKS,
                    element: <TaskPage />,
                  },
                  {
                    path: ROUTES.PRIVATE.PROJECTS.SETTINGS.ROOT,
                    element: <SettingsPage />,
                    children: [
                      {
                        index: true,
                        element: <GeneralSettingPage />,
                      },
                      {
                        path: "general",
                        element: <GeneralSettingPage />,
                      },
                      {
                        path: "filters",
                        element: <FilterSettingPage />,
                      },
                      {
                        path: "access-control",
                        loader: accessControllerLoader,
                        element: <AccessControlPage />,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
