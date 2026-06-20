"use client"

import { useGetStoreFront } from "@/hooks/use-get-store-front"
import Link from "next/link"

export function Navbar() {
  const { menus, isLoading } = useGetStoreFront()

  //
  if (menus?.length === 0) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-gray-500">
          {isLoading ? "Đang tải..." : "Không có menu nào"}
        </p>
      </div>
    )
  }

  //
  return (
    <nav className="grid grid-cols-12 bg-gray-50">
      <div className="col-span-2"></div>
      <div className="col-span-8 flex h-8 items-center justify-center gap-x-4">
        {menus.map((menu) => (
          <Link
            key={menu.id}
            href={menu.link}
            className="text-sm text-sky-600 hover:text-sky-700 font-medium"
          >
            {menu.name}
          </Link>
        ))}
      </div>
      <div className="col-span-2"></div>
    </nav>
  )
}
