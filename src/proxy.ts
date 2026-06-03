import { type NextRequest, NextResponse } from "next/server"

const legacyPrefixes = ["/docs", "/blog"]

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get("token")?.value || ""

  if (legacyPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  if (!token && pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  if (token && pathname === "/") {
    return NextResponse.redirect(new URL(`/staff/account?t=1`, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/campaigns/:path*",
    "/management/:path*",
    "/products/:path*",
    "/inventories/:path*",
    "/staff/account",
  ],
}
