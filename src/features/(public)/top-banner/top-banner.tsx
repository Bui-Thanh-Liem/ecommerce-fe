import Image from "next/image"

export function TopBanner() {
  return (
    <header className="grid h-11 grid-cols-12 bg-amber-300">
      <div className="col-span-2"></div>
      <div className="relative col-span-8 flex items-center justify-center bg-white">
        <Image src="/images/top-banner.png" alt="Top Banner" priority fill />
      </div>
      <div className="col-span-2"></div>
    </header>
  )
}
