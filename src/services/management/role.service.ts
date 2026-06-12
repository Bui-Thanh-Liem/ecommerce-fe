import { QueryDto } from "@/shared/dtos/common/query.dto"
import { CreateRoleDto, UpdateRoleDto } from "@/shared/dtos/req/role.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { IRole } from "@/shared/interfaces/models/management/role.interface"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const roleServices = {
  create: async (payload: CreateRoleDto) => {
    const res = await apiCall<IRole>("/roles", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<IRole>(res)
  },

  findOptions: async (query?: QueryDto<IRole>) => {
    const queryParams = generateQueryParams(query)

    const res = await apiCall<ResMetadataDto<IRole>>(
      `/roles/options?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<IRole>>(res)
  },

  findAll: async (query?: QueryDto<IRole>) => {
    const queryParams = generateQueryParams(query)

    const res = await apiCall<ResMetadataDto<IRole>>(`/roles?${queryParams}`, {
      method: "GET",
    })

    return handleResponse<ResMetadataDto<IRole>>(res)
  },

  update: async (id: string, payload: UpdateRoleDto) => {
    const res = await apiCall<IRole>(`/roles/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse<IRole>(res)
  },
}
