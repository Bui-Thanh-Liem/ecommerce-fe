import { CreateRoleDto } from "@/shared/dtos/req/create-role.dto"
import { IRole } from "@/shared/interfaces/models/role.interface"
import { apiCall } from "@/utils/call-api.util"
import { handleResponse } from "@/utils/handle-response.util"

export const roleServices = {
  create: async (payload: CreateRoleDto) => {
    const res = await apiCall<IRole>("/roles", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<IRole>(res)
  },

  findAll: async () => {
    const res = await apiCall<IRole[]>("/roles", {
      method: "GET",
    })

    return handleResponse<IRole[]>(res)
  },
}
