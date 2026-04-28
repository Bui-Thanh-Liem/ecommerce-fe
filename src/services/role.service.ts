import { CreateRoleDto } from "@/shared/dtos/req/create-role.dto"
import { IRole } from "@/shared/interfaces/models/role.interface"
import { apiCall } from "@/utils/call-api.util"
import { toast } from "sonner"

export const roleServices = {
  create: async (payload: CreateRoleDto) => {
    const res = await apiCall<IRole>("/roles", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    if (res.statusCode !== 201) {
      toast.error(res.message || "Failed to create role")
      return null
    }

    return res
  },

  findAll: async () => {
    const res = await apiCall<IRole[]>("/roles", {
      method: "GET",
    })

    return res
  },
}
