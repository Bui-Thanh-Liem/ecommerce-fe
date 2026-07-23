import { type NextRequest, NextResponse } from "next/server"

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const tokenStaff = req.cookies.get("e_token")?.value || ""
  const tokenCustomer = req.cookies.get("e_token_customer")?.value || ""

  // ==========================================
  // 1. LUỒNG CUSTOMER (Xử lý riêng biệt)
  // ==========================================
  if (pathname.startsWith("/customer")) {
    if (tokenCustomer && pathname === "/customer/login") {
      // Đã login customer rồi thì không cho vào trang login nữa
      return NextResponse.redirect(new URL("/customer", req.url))
    }
    if (!tokenCustomer && pathname !== "/customer/login") {
      // Chưa login customer thì bắt buộc về login
      return NextResponse.redirect(new URL("/customer/login", req.url))
    }
    return NextResponse.next()
  }

  // ==========================================
  // 2. LUỒNG STAFF / MANAGEMENT
  // ==========================================
  if (pathname === "/auth") {
    if (tokenStaff) {
      // Staff đã login mà cố tình vào /auth
      return NextResponse.redirect(new URL(`/staffs/account?t=1`, req.url))
    }
    return NextResponse.next() // Chưa login thì cho vào /auth
  }

  // Bảo vệ tất cả các route staff còn lại nằm trong matcher
  if (!tokenStaff) {
    return NextResponse.redirect(new URL("/auth", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/auth",
    "/dashboard/:path*",
    "/store-front/:path*",
    "/staffs/:path*",
    "/management/:path*",
    "/products/:path*",
    "/catalog/:path*",
    "/inventories/:path*",
    "/chatbot/:path*",
    "/marketing-programs/:path*",
    "/customers/:path*",
    "/orders/:path*",

    // Bắt buộc phải giữ 2 route này ở đây để middleware xử lý luồng Customer
    "/customer",
    "/customer/:path*",
  ],
}
