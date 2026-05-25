"use client"

import * as React from "react"
import { NavMain } from "@/features/navbar/nav-main"
import { NavStaff } from "@/features/navbar/nav-staff"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ShoppingBag } from "lucide-react"
import { NavCatalog } from "../features/navbar/nav-catalog"
import { NavSecondary } from "../features/navbar/nav-secondary"
import { NavManagement } from "../features/navbar/nav-management"
import { NavInventory } from "../features/navbar/nav-inventory"

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
        <NavMain />
        <NavManagement />
        <NavCatalog />
        <NavInventory />
        <NavSecondary />
      </SidebarContent>
      <SidebarFooter>
        <NavStaff />
      </SidebarFooter>
    </Sidebar>
  )
}
