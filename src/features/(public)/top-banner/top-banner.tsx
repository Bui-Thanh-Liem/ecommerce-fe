"use client"

import { useGetStoreFront } from "@/hooks/use-get-store-front"
import Image from "next/image"
import Link from "next/link"

export function TopBanner() {
  const { topBanner } = useGetStoreFront()

  //
  if (!topBanner) return null

  //
  return (
    <header className="grid h-10 grid-cols-12 bg-blue-600">
      <div className="col-span-2"></div>
      <Link
        href={`/campaigns/${topBanner.slug}`}
        className="relative col-span-8 flex items-center justify-center"
      >
        <Image src={topBanner.image?.url} alt={topBanner.title} priority fill />
      </Link>
      <div className="col-span-2"></div>
    </header>
  )
}
