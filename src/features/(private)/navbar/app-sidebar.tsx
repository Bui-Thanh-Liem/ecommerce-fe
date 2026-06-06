"use client"

import * as React from "react"
import { NavMain } from "@/features/(private)/navbar/nav-main"
import { NavStaff } from "@/features/(private)/navbar/nav-staff"
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
import { NavCatalog } from "./nav-catalog"
import { NavSecondary } from "./nav-secondary"
import { NavManagement } from "./nav-management"
import { NavInventory } from "./nav-inventory"
import { NavCampaign } from "./nav-campaign"
import { NavCustomer } from "./nav-customer"
import Link from "next/link"

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
              <Link href="/dashboard">
                <ShoppingBag className="size-5!" />
                <span className="text-base font-semibold">E-commerce.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavManagement />
        <NavCatalog />
        <NavInventory />
        <NavCampaign />
        <NavCustomer />
        <NavSecondary />
      </SidebarContent>
      <SidebarFooter>
        <NavStaff />
      </SidebarFooter>
    </Sidebar>
  )
}
