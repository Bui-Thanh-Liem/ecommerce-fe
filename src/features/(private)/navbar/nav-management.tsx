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
import {
  MoreHorizontalIcon,
  ScrollText,
  User,
  UserRoundKey,
  UsersIcon,
} from "lucide-react"
import Link from "next/link"
import { Badge } from "../../../components/ui/badge"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export function NavManagement() {
  const { isMobile } = useSidebar()
  const pathname = usePathname()

  const mainItems = [
    {
      title: "Staffs",
      url: "/management/staffs",
      icon: <User />,
    },
  ]

  const secondaryItems = [
    {
      title: "Teams",
      url: "/management/teams",
      icon: <UsersIcon />,
    },
    {
      title: "Permissions",
      url: "/management/permissions",
      icon: <UserRoundKey />,
    },
    {
      title: "Roles",
      url: "/management/roles",
      icon: <UserRoundKey />,
    },
    {
      title: "Team Categories",
      url: "/management/team-categories",
      icon: <UsersIcon />,
    },
    {
      title: "Audit Logs",
      url: "/management/audit-logs",
      icon: <ScrollText />,
    },
  ]

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="gap-x-1 uppercase">
        Management
        <Badge variant="destructive" className="mb-3">
          high
        </Badge>
      </SidebarGroupLabel>
      <SidebarMenu>
        {mainItems.map((item) => (
          <SidebarMenuItem
            key={item.title}
            className={cn(
              pathname === `${item.url}` ? "rounded-full bg-gray-100" : ""
            )}
          >
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
              <SidebarMenuButton
                className={cn(
                  "text-sidebar-foreground/70",
                  secondaryItems.some((item) => pathname === `${item.url}`) &&
                    "bg-gray-100"
                )}
              >
                <MoreHorizontalIcon className="text-sidebar-foreground/70" />
                <span>More</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            {/*  */}
            <DropdownMenuContent
              side="bottom"
              className="space-y-0.5 rounded-2xl"
              align={isMobile ? "end" : "start"}
            >
              {secondaryItems.map((item) => (
                <DropdownMenuItem
                  key={item.title}
                  asChild
                  className={cn(
                    pathname === `${item.url}` ? "rounded-full bg-gray-100" : ""
                  )}
                >
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
