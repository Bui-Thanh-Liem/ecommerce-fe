import { IPermission } from "@/shared/interfaces/models/permission.interface"
import { apiCall } from "@/utils/call-api.util"
import { handleResponse } from "@/utils/handle-response.util"

export const permissionServices = {
  findAll: async () => {
    const res = await apiCall<IPermission[]>("/permissions", {
      method: "GET",
    })

    return handleResponse<IPermission[]>(res)
  },
}
