import { OkResponse } from "@/shared/classes/response.class"
import { toast } from "sonner"

export function handleResponse<T>(res: OkResponse<T>): OkResponse<T> | null {
  if ([200, 201].includes(res.statusCode)) {
    toast.success(res.message || "Success")
    return res
  } else if (res.statusCode === 401 && res.message === "Unauthorized") {
    window.location.href = "/"
    return null
  } else {
    toast.error(res.message || "An error occurred")
    throw new Error(res.message || "Request failed")
  }
}
