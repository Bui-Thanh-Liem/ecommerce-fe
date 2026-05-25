"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  MoreHorizontalIcon,
  ShelvingUnit,
  MapPinned,
  Store,
} from "lucide-react"
import Link from "next/link"
import { Badge } from "../../components/ui/badge"

export function NavInventory() {
  const { isMobile } = useSidebar()

  const mainItems = [
    {
      title: "Stores/Warehouses",
      url: "stores-warehouses",
      icon: <Store />,
    },
  ]

  const secondaryItems = [
    {
      title: "Inventories",
      url: "inventories",
      icon: <ShelvingUnit />,
    },
    {
      title: "Locations Regions",
      url: "location-regions",
      icon: <MapPinned />,
    },
  ]

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="gap-x-1 uppercase">
        INVENTORY
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
