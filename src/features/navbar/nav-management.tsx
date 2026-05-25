"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator, // đường kẽ
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction, // có sẵn hover
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { MoreHorizontalIcon, User, UserRoundKey, UsersIcon } from "lucide-react"
import Link from "next/link"
import { Badge } from "../../components/ui/badge"

export function NavManagement() {
  const { isMobile } = useSidebar()

  const mainItems = [
    {
      title: "Staffs",
      url: "staffs",
      icon: <User />,
    },
  ]

  const secondaryItems = [
    {
      title: "Teams",
      url: "teams",
      icon: <UsersIcon />,
    },
    {
      title: "Permissions",
      url: "permissions",
      icon: <UserRoundKey />,
    },
    {
      title: "Roles",
      url: "roles",
      icon: <UserRoundKey />,
    },
    {
      title: "Team Categories",
      url: "team-categories",
      icon: <UsersIcon />,
    },
  ]

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="gap-x-1 uppercase">
        Management
        <Badge variant="destructive" className="mb-3">
          admin
        </Badge>
      </SidebarGroupLabel>
      <SidebarMenu>
        {mainItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <Link href={item.url}>
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <DropdownMenu>
            {/*  */}
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="text-sidebar-foreground/70">
                <MoreHorizontalIcon className="text-sidebar-foreground/70" />
                <span>More</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            {/*  */}
            <DropdownMenuContent
              side="bottom"
              className="rounded-2xl"
              align={isMobile ? "end" : "start"}
            >
              {secondaryItems.map((item) => (
                <DropdownMenuItem key={item.title} asChild>
                  <Link href={item.url}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
