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
import { Headphones, MoreHorizontalIcon, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { Badge } from "../../../components/ui/badge"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function NavReport() {
  const { isMobile } = useSidebar()
  const pathname = usePathname()

  const mainItems = [
    {
      title: "Revenue",
      url: "/reports/revenue",
      icon: <Headphones />,
    },
  ]

  const secondaryItems = [
    {
      title: "Orders",
      url: "/reports/orders",
      icon: <ShoppingCart />,
    },
    {
      title: "Inventory",
      url: "/reports/inventory",
      icon: <ShoppingCart />,
    },
    {
      title: "Customers",
      url: "/reports/customers",
      icon: <ShoppingCart />,
    },
    {
      title: "Marketing",
      url: "/reports/marketing",
      icon: <ShoppingCart />,
    },
  ]

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="gap-x-1 uppercase">
        REPORTS
        <Badge className="mb-3 bg-green-50 text-green-700">Low</Badge>
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
