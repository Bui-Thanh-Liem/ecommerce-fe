"use client"
import { OkResponse } from "@/shared/classes/response.class"
import { deleteStorage } from "./delete-storage.util"

export const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<OkResponse<T>> => {
  try {
    // Tạo headers object
    const headers: HeadersInit = {}

    // CHỈ set Content-Type cho non-FormData requests
    // Nếu là FormData, để browser tự động set Content-Type với boundary
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json"
    }

    const config: RequestInit = {
      method: "GET",
      ...options, // Spread options trước
      headers: {
        ...headers,
        ...options.headers, // Allow override từ options
        "idempotency-key": crypto.randomUUID(),
      },
    }

    // Initial API call
    let response = await fetch(`/api/${endpoint}`, config)
    let result = (await response.json()) as OkResponse<T>
    const { statusCode, message } = result

    // Tại đây kiểm tra xem có hết hạn access_token không, có thì refresh lại access_token
    if (statusCode === 401) {
      if (message === ("TokenExpiredError" as const)) {
        // Gọi API refresh token để  lấy access_token mới
        await fetch("/api/staff-auth/refresh-token", {
          ...config,
          method: "POST",
        })

        // Sau khi refresh token thành công, gọi lại API ban đầu với access_token mới
        response = await fetch(`/api/${endpoint}`, config)
        result = (await response.json()) as OkResponse<T>
        const { statusCode } = result

        // Trường hợp refresh token hết hạn (BE xoa cookie refresh token va access token)
        if (statusCode === 401) {
          deleteStorage("staff")
        }
      }

      //
      if (message === ("TokenCustomerExpiredError" as const)) {
        // Gọi API refresh token để  lấy access_token mới
        await fetch("/api/customer-auth/refresh-token", {
          ...config,
          method: "POST",
        })

        // Sau khi refresh token thành công, gọi lại API ban đầu với access_token mới
        response = await fetch(`/api/${endpoint}`, config)
        result = (await response.json()) as OkResponse<T>
        const { statusCode } = result

        // Trường hợp refresh token hết hạn (BE xoa cookie refresh token va access token)
        if (statusCode === 401) {
          deleteStorage("customer")
        }
      }

      //
      if (message === "Unauthorized") {
        // 2. Nếu 401 mà mesage không phải "TokenExpiredError" là token không hợp lệ, cho staff login lại
        deleteStorage("staff")
        await fetch("/api/staff-auth/signout", {
          method: "POST",
        })
      }

      //
      if (message === "Unauthorized Customer") {
        // 2. Nếu 401 mà mesage không phải "TokenExpiredError" là token không hợp lệ, cho customer login lại
        deleteStorage("customer")
        await fetch("/api/customer-auth/signout", {
          method: "POST",
        })
      }
    }

    return result
  } catch (error) {
    console.error("API call error:", error)
    throw error
  }
}
