"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useStaffContext } from "@/context/staff.context"
import { useSignOut } from "@/hooks/apis/use-auth"
import {
  EllipsisVerticalIcon,
  CircleUserRoundIcon,
  LogOutIcon,
  Settings2Icon,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function NavStaff() {
  const router = useRouter()
  const { isMobile } = useSidebar()
  const { staff } = useStaffContext()
  const signOutApi = useSignOut()

  //
  async function handleLogout() {
    const res = await signOutApi.mutateAsync()
    if (res?.statusCode === 201) {
      router.replace("/")
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={staff?.avatar?.url} alt={staff?.fullName} />
                <AvatarFallback className="rounded-lg">AV</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {staff?.fullName || "Error"}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {staff?.email || "Error"}
                </span>
              </div>
              <EllipsisVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-2xl"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={staff?.avatar?.url} alt={staff?.fullName} />
                  <AvatarFallback className="rounded-lg">AV</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {staff?.fullName || "Error"}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {staff?.email || "Error"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/staff/account">
                <DropdownMenuItem>
                  <CircleUserRoundIcon />
                  Account
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem>
                <Settings2Icon />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout} variant="destructive">
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
