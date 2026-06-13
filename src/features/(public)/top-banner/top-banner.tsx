import Image from "next/image"
import Link from "next/link"

export function TopBanner() {
  return (
    <header className="grid h-10 grid-cols-12 bg-blue-600">
      <div className="col-span-2"></div>
      <Link
        href={"/"}
        className="relative col-span-8 flex items-center justify-center"
      >
        <Image src="/images/top-banner.png" alt="Top Banner" priority fill />
      </Link>
      <div className="col-span-2"></div>
    </header>
  )
}
