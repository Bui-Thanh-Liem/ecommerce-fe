import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateCampaignDto,
  UpdateCampaignDto,
} from "@/shared/dtos/req/campaign.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { ICampaign } from "@/shared/interfaces/models/campaign.interface"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const campaignServices = {
  create: async (payload: CreateCampaignDto) => {
    const res = await apiCall<ICampaign>("/campaigns", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<ICampaign>(res)
  },

  findAll: async (query?: QueryDto<ICampaign>) => {
    const queryParams = generateQueryParams(query)

    const res = await apiCall<ResMetadataDto<ICampaign>>(
      `/campaigns?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<ICampaign>>(res)
  },

  findOptions: async (query?: QueryDto<ICampaign>) => {
    const queryParams = generateQueryParams(query)

    const res = await apiCall<ResMetadataDto<ICampaign>>(
      `/campaigns/options?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<ICampaign>>(res)
  },

  update: async (id: string, payload: UpdateCampaignDto) => {
    const res = await apiCall<ICampaign>(`/campaigns/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse<ICampaign>(res)
  },

  delete: async (id: string) => {
    const res = await apiCall(`/campaigns/${id}`, {
      method: "DELETE",
    })

    return handleResponse(res)
  },
}
