"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useGetStoreFront } from "@/hooks/use-get-store-front"
import Link from "next/link"

export function Navbar() {
  const { menus, isLoading } = useGetStoreFront()

  if (isLoading) {
    return (
      <nav className="grid grid-cols-12 bg-gray-50">
        <div className="col-span-2" />

        <div className="col-span-8 flex h-8 items-center justify-center gap-x-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-18" />
        </div>

        <div className="col-span-2" />
      </nav>
    )
  }

  //
  if (!menus?.length) return null

  //
  return (
    <nav className="grid grid-cols-12 bg-gray-50">
      <div className="col-span-2"></div>
      <div className="col-span-8 flex h-8 items-center justify-center gap-x-4">
        {menus.map((menu) => (
          <Link
            key={menu.id}
            href={`/${menu?.categorySlug}`}
            className="text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            {menu.name}
          </Link>
        ))}
      </div>
      <div className="col-span-2"></div>
    </nav>
  )
}
