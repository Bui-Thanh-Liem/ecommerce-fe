import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateTeamCategoryDto,
  UpdateTeamCategoryDto,
} from "@/shared/dtos/req/team-category.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { ITeamCategory } from "@/shared/interfaces/models/team-category.interface"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const teamCategoryServices = {
  create: async (payload: CreateTeamCategoryDto) => {
    const res = await apiCall<ITeamCategory>("/team-categories", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<ITeamCategory>(res)
  },

  update: async (id: string, payload: UpdateTeamCategoryDto) => {
    const res = await apiCall<ITeamCategory>(`/team-categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse<ITeamCategory>(res)
  },

  findAll: async (query?: QueryDto) => {
    const queryParams = generateQueryParams(query)

    const res = await apiCall<ResMetadataDto<ITeamCategory>>(
      `/team-categories?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<ITeamCategory>>(res)
  },

  findAllByStore: async (storeId: string) => {
    console.log(`Fetching team categories for store: ${storeId}`)

    const res = await apiCall<ITeamCategory[]>(
      `/team-categories/store/${storeId}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ITeamCategory[]>(res)
  },

  delete: async (id: string) => {
    const res = await apiCall(`/team-categories/${id}`, {
      method: "DELETE",
    })

    return handleResponse(res)
  },
}
