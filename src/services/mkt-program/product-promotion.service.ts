import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateProductPromotionDto,
  UpdateProductPromotionDto,
} from "@/shared/dtos/req/product-promotion.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { IProductPromotion } from "@/shared/interfaces/models/mkt-program/product-promotion.interface"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const productPromotionServices = {
  create: async (payload: CreateProductPromotionDto) => {
    const res = await apiCall<IProductPromotion>("/product-promotions", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<IProductPromotion>(res)
  },

  update: async (id: string, payload: UpdateProductPromotionDto) => {
    const res = await apiCall<IProductPromotion>(`/product-promotions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse<IProductPromotion>(res)
  },

  findAll: async (query?: QueryDto) => {
    const queryParams = generateQueryParams(query)

    const res = await apiCall<ResMetadataDto<IProductPromotion>>(
      `/product-promotions?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<IProductPromotion>>(res)
  },

  findOptions: async (query?: QueryDto) => {
    const queryParams = generateQueryParams(query)

    const res = await apiCall<ResMetadataDto<IProductPromotion>>(
      `/product-promotions/options?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<IProductPromotion>>(res)
  },

  getTreeData: async (query?: QueryDto) => {
    const queryParams = generateQueryParams(query)

    const res = await apiCall<IProductPromotion[]>(
      `/product-promotions/tree?${queryParams.toString()}`,
      {
        method: "GET",
      }
    )
    return handleResponse<IProductPromotion[]>(res)
  },

  delete: async (id: string) => {
    const res = await apiCall(`/product-promotions/${id}`, {
      method: "DELETE",
    })

    return handleResponse(res)
  },
}
