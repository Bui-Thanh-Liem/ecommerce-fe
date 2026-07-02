"use client"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function SiteHeader() {
  const pathname = usePathname()
  const page = pathname.split("/").filter(Boolean)[0] || ""

  const dataTab: Record<string, { name: string; url: string }[]> = {
    ["chatbot"]: [
      {
        name: "Internal Chatbot",
        url: "/chatbot/internal",
      },
      {
        name: "Public Chatbot",
        url: "/chatbot/public",
      },
    ],
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center lg:gap-2 lg:px-6">
        <div className="flex items-center">
          <SidebarTrigger />
          <Separator
            orientation="vertical"
            className="mx-6 data-[orientation=vertical]:h-8"
          />
        </div>

        <div>
          {dataTab[page]?.map((tab) => (
            <Link
              key={tab.url}
              href={tab.url}
              className={`relative ml-2 rounded-2xl px-4 py-1 text-sm font-semibold tracking-wide transition-all duration-200 ease-in-out ${
                pathname === tab.url
                  ? "text-primary border border-gray-100 bg-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {tab.name?.toLocaleUpperCase()}

              {/* Chỉ render mũi tên nếu tab đang active */}
              {pathname === tab.url && (
                <div className="absolute top-[130%] left-1/2 h-2 w-2 -translate-x-1/2 -rotate-45 border-t border-r bg-white" />
              )}
            </Link>
          )) || null}
        </div>
        <div></div>
      </div>
    </header>
  )
}
