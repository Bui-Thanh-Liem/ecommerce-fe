import { QueryDto } from "@/shared/dtos/common/query.dto"
import { CreateMenuDto, UpdateMenuDto } from "@/shared/dtos/req/menu.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { IMenu } from "@/shared/interfaces/models/store-front/menu.interface"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const menuServices = {
  create: async (payload: CreateMenuDto) => {
    const res = await apiCall<IMenu>("/menus", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<IMenu>(res)
  },

  findAll: async (query?: QueryDto<IMenu>) => {
    const queryParams = generateQueryParams(query)

    const res = await apiCall<ResMetadataDto<IMenu>>(`/menus?${queryParams}`, {
      method: "GET",
    })

    return handleResponse<ResMetadataDto<IMenu>>(res)
  },

  findOptions: async (query?: QueryDto<IMenu>) => {
    const queryParams = generateQueryParams(query)

    const res = await apiCall<ResMetadataDto<IMenu>>(
      `/menus/options?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<IMenu>>(res)
  },

  update: async (id: string, payload: UpdateMenuDto) => {
    const res = await apiCall<IMenu>(`/menus/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse<IMenu>(res)
  },

  delete: async (id: string) => {
    const res = await apiCall(`/menus/${id}`, {
      method: "DELETE",
    })

    return handleResponse(res)
  },
}
