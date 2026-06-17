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
    const response = await fetch(`/api/${endpoint}`, config)
    const result = (await response.json()) as OkResponse<T>
    const { statusCode, message } = result

    // 1. Tại đây kiểm tra xem có hết hạn access_token không, có thì refresh lại access_token
    if (statusCode === 401 && message === ("jwt expired" as const)) {
      // Gọi API refresh token
      // ... code sau, hiện tại cho phiên làm việc của staff là 8h.
      deleteStorage()
    } else if ([401].includes(statusCode)) {
      // 2. Nếu 401 mà mesage không phải "jwt expired" là token không hợp lệ, cho staff login lại
      deleteStorage()
    }

    return result
  } catch (error) {
    console.error("API call error:", error)
    throw error
  }
}
