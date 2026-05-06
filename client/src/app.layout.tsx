import { Outlet, useLocation, useParams } from "react-router";
import { AppSidebar } from "@/components/app-sidebar";
import AppDataProvider from "./providers/app-data";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { PathNameBreadcrumb } from "./components/pathname-breadcrumb";
import { RightSidebar } from "./components/right-sidebar";

export default function AppLayout() {
  return (
    <>
      <AppDataProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <ShowHeader />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
              <Outlet />
            </div>
          </SidebarInset>
          <ShowRightSidebar />
        </SidebarProvider>
      </AppDataProvider>
    </>
  );
}

function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 sticky top-0">
      <div className="flex items-center gap-2 p-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />

        <PathNameBreadcrumb />
      </div>
    </header>
  );
}

function ShowHeader() {
  const location = useLocation();
  const excludePatterns = [/^.*\/communications\/.*$/];

  console.log(excludePatterns[0].test("abc/communications/abc"))

  const shouldExclude = excludePatterns.some((pattern) =>
    pattern.test(location.pathname),
  );

  if (shouldExclude) {
    return null;
  }

  return <Header />;
}

function ShowRightSidebar() {
  const { channelId } = useParams();

  if (!channelId) {
    return null;
  }

  return <RightSidebar />;
}
