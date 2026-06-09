"use client"

import { useFindOptionsProductNavbars } from "@/hooks/apis/use-product-navbar"
import Link from "next/link"

export function Navbar() {
  const { data } = useFindOptionsProductNavbars()
  const navbars = data?.metadata?.data || []

  if (navbars.length === 0) return null

  return (
    <nav className="grid grid-cols-12 bg-white">
      <div className="col-span-2"></div>
      <div className="col-span-8 flex h-8 items-center justify-center">
        {navbars.map((navbar) => (
          <Link
            key={navbar.id}
            href={navbar.link}
            className="mx-4 text-sm text-sky-600 hover:text-sky-700"
          >
            {navbar.name}
          </Link>
        ))}
      </div>
      <div className="col-span-2"></div>
    </nav>
  )
}
