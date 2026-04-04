import { ChevronRight, File, Plus, Trash, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link, useParams } from "react-router";
import { useAppContext } from "@/contexts/app.context";
import { ROUTES } from "@/_routes.constants";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    collapsable?: boolean;
  }[];
}) {
  const ctx = useAppContext();
  const { projectId } = useParams();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Resources</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              {item.collapsable ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}

                      <span>{item.title}</span>

                      <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />

                      <div
                        className="ml-auto cursor-pointer hover:bg-muted/50"
                        onClick={ctx.handleCreateNewPage}
                      >
                        <Plus size={16} />
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {ctx.pagesMetaSortByUpdatedAt?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem._id}>
                          <SidebarMenuSubButton asChild>
                            <Link
                              to={`${ROUTES.PRIVATE.PROJECTS.ROOT}/${projectId}/${ROUTES.PRIVATE.PROJECTS.PAGES}/${subItem.page}`}
                            >
                              <File />
                              <span>{subItem.title}</span>
                              <Trash
                                className="ml-auto cursor-pointer"
                                size={16}
                                color="red"
                                onClick={ctx.handleDeletePage(subItem._id)}
                              />
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : (
                <Link
                  to={`${ROUTES.PRIVATE.PROJECTS.ROOT}/${projectId}/${item.url}`}
                >
                  <SidebarMenuButton className="cursor-pointer">
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
