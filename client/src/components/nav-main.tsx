import { ChevronRight, File, Plus, type LucideIcon } from "lucide-react";

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
import { Link } from "react-router";
import { Button } from "./ui/button";
import { useAppContext } from "@/contexts/app.context";

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

                      <Button
                        className="ml-auto cursor-pointer"
                        size={"xs"}
                        onClick={ctx.handleCreateNewPage}
                        asChild
                      >
                        <Plus size={16} />
                      </Button>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {ctx.pagesMeta?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.clientId}>
                          <SidebarMenuSubButton asChild>
                            <Link to={`/me/pages/${subItem.clientId}`}>
                              <File />
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : (
                <Link to={`/me/workspaces/${item.title}`}>
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
