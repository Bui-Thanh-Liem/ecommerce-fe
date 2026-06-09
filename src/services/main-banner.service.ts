import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateMainBannerDto,
  UpdateMainBannerDto,
} from "@/shared/dtos/req/main-banner.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { IMainBanner } from "@/shared/interfaces/models/main-banner.interface"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const mainBannerServices = {
  create: async (payload: CreateMainBannerDto) => {
    const res = await apiCall<IMainBanner>("/main-banners", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<IMainBanner>(res)
  },

  update: async (id: string, payload: UpdateMainBannerDto) => {
    const res = await apiCall(`/main-banners/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse(res)
  },

  findAll: async (query?: QueryDto) => {
    const queryParams = generateQueryParams(query)

    const res = await apiCall<ResMetadataDto<IMainBanner>>(
      `/main-banners?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<IMainBanner>>(res)
  },

  findOptions: async () => {
    const res = await apiCall<ResMetadataDto<IMainBanner>>(
      `/main-banners/options`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<IMainBanner>>(res)
  },

  delete: async (id: string) => {
    const res = await apiCall(`/main-banners/${id}`, {
      method: "DELETE",
    })

    return handleResponse(res)
  },
}
