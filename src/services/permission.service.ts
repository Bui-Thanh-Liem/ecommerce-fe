import { IPermission } from "@/shared/interfaces/models/permission.interface"
import { apiCall } from "@/utils/call-api.util"
import { toast } from "sonner"

export const permissionServices = {
  findAll: async () => {
    const res = await apiCall<IPermission[]>("/permissions", {
      method: "GET",
    })

    if (res.statusCode !== 200) {
      toast.error(res.message || "Failed to sign in")
      return null
    }

    return res
  },
}
