"use client"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { BotMessageSquare, SearchIcon } from "lucide-react"

export function NavSecondary() {
  const mainItems = [
    {
      title: "Get help with AI",
      url: "#",
      icon: <BotMessageSquare />,
    },
    {
      title: "Search",
      url: "#",
      icon: <SearchIcon />,
    },
  ]

  return (
    <SidebarGroup className="mt-auto">
      <SidebarGroupContent>
        <SidebarMenu>
          {mainItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  {item.icon}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
