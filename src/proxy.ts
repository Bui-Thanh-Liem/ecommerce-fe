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

  // Trường hợp này staff vào thông qua tự chỉnh URL (hành động bất thường)
  if (token && pathname === "/auth") {
    return NextResponse.redirect(new URL(`/staffs/account?t=1`, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",

    "/store-front/:path*",

    "/auth",
    "/staffs/:path*",
    "/management/:path*",

    "/products/:path*",
    "/catalog/:path*",

    "/inventories/:path*",

    "/marketing-programs/:path*",

    "/customers/:path*",

    "/orders/:path*",
  ],
}
