import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateCategoryPromotionDto,
  UpdateCategoryPromotionDto,
} from "@/shared/dtos/req/category-promotion.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { IProductVariant } from "@/shared/interfaces/models/catalog/product-variant.interface"
import { ICategoryPromotion } from "@/shared/interfaces/models/mkt-program/category-promotion.interface"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const categoryPromotionServices = {
  create: async (payload: CreateCategoryPromotionDto) => {
    const res = await apiCall<ICategoryPromotion>("/category-promotions", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<ICategoryPromotion>(res)
  },

  update: async (id: string, payload: UpdateCategoryPromotionDto) => {
    const res = await apiCall<ICategoryPromotion>(
      `/category-promotions/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    )

    return handleResponse<ICategoryPromotion>(res)
  },

  findAll: async (query?: QueryDto) => {
    const queryParams = generateQueryParams({ params: query })

    const res = await apiCall<ResMetadataDto<ICategoryPromotion>>(
      `/category-promotions?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<ICategoryPromotion>>(res)
  },

  findOptions: async (query?: QueryDto) => {
    const queryParams = generateQueryParams({ params: query, isOption: true })

    const res = await apiCall<ResMetadataDto<ICategoryPromotion>>(
      `/category-promotions/options?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<ICategoryPromotion>>(res)
  },

  findVariantByPromotion: async (query?: QueryDto) => {
    const queryParams = generateQueryParams({ params: query })

    const res = await apiCall<
      ResMetadataDto<ICategoryPromotion & { productVariant: IProductVariant }>
    >(`/category-promotions/variants?${queryParams}`, {
      method: "GET",
    })

    return handleResponse<
      ResMetadataDto<ICategoryPromotion & { productVariant: IProductVariant }>
    >(res)
  },

  getTreeData: async (query?: QueryDto) => {
    const queryParams = generateQueryParams({ params: query })

    const res = await apiCall<ICategoryPromotion[]>(
      `/category-promotions/tree?${queryParams.toString()}`,
      {
        method: "GET",
      }
    )
    return handleResponse<ICategoryPromotion[]>(res)
  },

  delete: async (id: string) => {
    const res = await apiCall(`/category-promotions/${id}`, {
      method: "DELETE",
    })

    return handleResponse(res)
  },
}
