import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreatePromotionDto,
  UpdatePromotionDto,
} from "@/shared/dtos/req/promotion.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { IPromotion } from "@/shared/interfaces/models/promotion.interface"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const promotionServices = {
  create: async (payload: CreatePromotionDto) => {
    const res = await apiCall<IPromotion>("/promotions", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<IPromotion>(res)
  },

  findAll: async (query?: QueryDto<IPromotion>) => {
    const queryParams = generateQueryParams(query)

    const res = await apiCall<ResMetadataDto<IPromotion>>(
      `/promotions?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<IPromotion>>(res)
  },

  update: async (id: string, payload: UpdatePromotionDto) => {
    const res = await apiCall<IPromotion>(`/promotions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse<IPromotion>(res)
  },

  delete: async (id: string) => {
    const res = await apiCall(`/promotions/${id}`, {
      method: "DELETE",
    })

    return handleResponse(res)
  },
}
