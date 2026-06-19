import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreatePopularSearchDto,
  UpdatePopularSearchDto,
} from "@/shared/dtos/req/popular-search.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { IPopularSearch } from "@/shared/interfaces/models/store-front/popular-search.interface"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const popularSearchServices = {
  create: async (payload: CreatePopularSearchDto) => {
    const res = await apiCall<IPopularSearch>("/popular-searches", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<IPopularSearch>(res)
  },

  findAll: async (query?: QueryDto<IPopularSearch>) => {
    const queryParams = generateQueryParams({ params: query })

    const res = await apiCall<ResMetadataDto<IPopularSearch>>(
      `/popular-searches?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<IPopularSearch>>(res)
  },

  findOptions: async (query?: QueryDto<IPopularSearch>) => {
    const queryParams = generateQueryParams({ params: query, isOption: true })

    const res = await apiCall<ResMetadataDto<IPopularSearch>>(
      `/popular-searches/options?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<IPopularSearch>>(res)
  },

  update: async (id: string, payload: UpdatePopularSearchDto) => {
    const res = await apiCall<IPopularSearch>(`/popular-searches/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse<IPopularSearch>(res)
  },

  delete: async (id: string) => {
    const res = await apiCall(`/popular-searches/${id}`, {
      method: "DELETE",
    })

    return handleResponse(res)
  },
}
