"use client"
import { OkResponse } from "@/shared/classes/response.class"
import { deleteStorage } from "./delete-storage.util"

export const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<OkResponse<T>> => {
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
      },
    }

    // Initial API call
    let response = await fetch(`/api/${endpoint}`, config)
    let result = (await response.json()) as OkResponse<T>
    const { statusCode, message } = result

    // 1. Tại đây kiểm tra xem có hết hạn access_token không, có thì refresh lại access_token
    if (statusCode === 401 && message === ("jwt expired" as const)) {
      // Gọi API refresh token để lấy access_token mới
      await apiCall<boolean>("/api/auth/refresh-token", {
        method: "POST",
      })

      // Sau khi refresh token thành công, gọi lại API ban đầu với access_token mới
      response = await fetch(`/api/${endpoint}`, config)
      result = (await response.json()) as OkResponse<T>
      const { statusCode, message } = result
      if (statusCode === 401 && message === ("jwt expired" as const)) {
        // Trường hợp refresh token cũng hết hạn, xóa storage và cho staff login lại
        deleteStorage()
        await apiCall<boolean>("/api/auth/logout", {
          method: "POST",
        })
      }
    } else if ([401].includes(statusCode)) {
      // 2. Nếu 401 mà mesage không phải "jwt expired" là token không hợp lệ, cho staff login lại
      deleteStorage()
      await apiCall<boolean>("/api/auth/logout", {
        method: "POST",
      })
    }

    return result
  } catch (error) {
    console.error("API call error:", error)
    throw error
  }
}
