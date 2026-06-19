import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateTopBannerDto,
  UpdateTopBannerDto,
} from "@/shared/dtos/req/top-banner.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { ITopBanner } from "@/shared/interfaces/models/store-front/top-banner.interface"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const topBannerServices = {
  create: async (payload: CreateTopBannerDto) => {
    const res = await apiCall<ITopBanner>("/top-banners", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<ITopBanner>(res)
  },

  update: async (id: string, payload: UpdateTopBannerDto) => {
    const res = await apiCall(`/top-banners/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse(res)
  },

  findAll: async (query?: QueryDto) => {
    const queryParams = generateQueryParams({ params: query })

    const res = await apiCall<ResMetadataDto<ITopBanner>>(
      `/top-banners?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<ITopBanner>>(res)
  },

  findOptions: async (query?: QueryDto) => {
    const queryParams = generateQueryParams({ params: query, isOption: true })
    const res = await apiCall<ResMetadataDto<ITopBanner>>(
      `/top-banners/options?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<ITopBanner>>(res)
  },

  delete: async (id: string) => {
    const res = await apiCall(`/top-banners/${id}`, {
      method: "DELETE",
    })

    return handleResponse(res)
  },
}
