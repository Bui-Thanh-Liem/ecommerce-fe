import { UpdatePermissionDto } from "@/shared/dtos/req/permission.dto"
import { IPermission } from "@/shared/interfaces/models/management/permission.interface"
import { apiCall } from "@/utils/call-api.util"
import { handleResponse } from "@/utils/handle-response.util"

export const permissionServices = {
  findAll: async () => {
    const res = await apiCall<IPermission[]>("/permissions", {
      method: "GET",
    })

    return handleResponse<IPermission[]>(res)
  },

  update: async (id: string, payload: UpdatePermissionDto) => {
    const res = await apiCall<IPermission>(`/permissions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse<IPermission>(res)
  },
}
