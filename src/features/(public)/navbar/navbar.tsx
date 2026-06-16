"use client"

import { useFindOptionsMenus } from "@/hooks/apis/store-front/use-menu"
import Link from "next/link"

export function Navbar() {
  const { data } = useFindOptionsMenus()
  const menus = data?.metadata?.data || []

  if (menus.length === 0) return null

  return (
    <nav className="grid grid-cols-12 bg-white">
      <div className="col-span-2"></div>
      <div className="col-span-8 flex h-8 items-center justify-center">
        {menus.map((menu) => (
          <Link
            key={menu.id}
            href={menu.link}
            className="mx-4 text-sm text-sky-600 hover:text-sky-700"
          >
            {menu.name}
          </Link>
        ))}
      </div>
      <div className="col-span-2"></div>
    </nav>
  )
}
