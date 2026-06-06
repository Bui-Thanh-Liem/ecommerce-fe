import { ShoppingBag } from "lucide-react"
import Link from "next/link"

export function Navbar() {
  return (
    <nav className="grid h-10 grid-cols-12 bg-sky-300">
      <div className="col-span-2"></div>
      <div className="col-span-8 flex items-center justify-center bg-white">
        <Link href="/" className="flex items-center justify-center gap-x-2">
          <ShoppingBag className="size-6!" />
          <span className="text-base font-semibold">E-commerce.</span>
        </Link>
      </div>
      <div className="col-span-2"></div>
    </nav>
  )
}
