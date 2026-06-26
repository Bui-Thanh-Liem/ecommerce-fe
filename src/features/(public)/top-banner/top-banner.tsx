"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useGetStoreFront } from "@/hooks/use-get-store-front"
import Image from "next/image"
import Link from "next/link"

export function TopBanner() {
  const { topBanner, isLoading } = useGetStoreFront()

  if (isLoading) {
    return (
      <header className="grid h-10 grid-cols-12">
        <div className="col-span-2" />
        <Skeleton className="col-span-8 h-full w-full rounded-none bg-blue-900" />
        <div className="col-span-2" />
      </header>
    )
  }

  //
  if (!topBanner) return null

  //
  return (
    <header className="grid h-10 grid-cols-12 bg-blue-600">
      <div className="col-span-2"></div>
      <Link
        href={`/campaign/${topBanner.slug}`}
        className="relative col-span-8 flex items-center justify-center"
      >
        <Image src={topBanner.image?.url} alt={topBanner.title} priority fill />
      </Link>
      <div className="col-span-2"></div>
    </header>
  )
}
