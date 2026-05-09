"use client"

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavStaff } from "@/components/nav-staff"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  CameraIcon,
  CircleHelpIcon,
  DatabaseIcon,
  FileChartColumnIcon,
  FileIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  MapPinned,
  SearchIcon,
  Settings2Icon,
  ShoppingBag,
  Store,
  Target,
  User,
  UserRoundKey,
  UsersIcon,
} from "lucide-react"
import { NavManagement } from "./nav-management"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "campaigns",
      url: "campaigns",
      icon: <Target />,
    },
  ],
  navManager: [
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
      title: "Staffs",
      url: "staffs",
      icon: <User />,
    },
    {
      title: "Teams",
      url: "teams",
      icon: <UsersIcon />,
    },
    {
      title: "Locations & Regions",
      url: "location-regions",
      icon: <MapPinned />,
    },
    {
      title: "Stores",
      url: "stores",
      icon: <Store />,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: <CameraIcon />,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: <FileTextIcon />,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: <FileTextIcon />,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
    },
    {
      title: "Get Help",
      url: "#",
      icon: <CircleHelpIcon />,
    },
    {
      title: "Search",
      url: "#",
      icon: <SearchIcon />,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: <DatabaseIcon />,
    },
    {
      name: "Reports",
      url: "#",
      icon: <FileChartColumnIcon />,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: <FileIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <ShoppingBag className="size-5!" />
                <span className="text-base font-semibold">E-commerce.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavManagement items={data.navManager} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavStaff />
      </SidebarFooter>
    </Sidebar>
  )
}
