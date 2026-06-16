import { type NextRequest, NextResponse } from "next/server"

const legacyPrefixes = ["/docs", "/blog"]

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get("e_token")?.value || ""

  if (legacyPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  if (!token && pathname !== "/auth") {
    return NextResponse.redirect(new URL("/auth", req.url))
  }

  if (token && pathname === "/auth") {
    return NextResponse.redirect(new URL(`/staffs/account?t=1`, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/auth",
    "/staffs/:path*",
    "/products/:path*",
    "/dashboard/:path*",
    "/customers/:path*",
    "/campaigns/:path*",
    "/management/:path*",
    "/inventories/:path*",
    "/store-front/:path*",
  ],
}
