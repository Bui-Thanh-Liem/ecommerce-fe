import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateProductVariantDto,
  UpdateProductVariantDto,
} from "@/shared/dtos/req/product-variant.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { IProductVariant } from "@/shared/interfaces/models/catalog/product-variant.interface"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const productVariantServices = {
  create: async (payload: CreateProductVariantDto) => {
    const res = await apiCall("/product-variants", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse(res)
  },

  findOptions: async (query?: QueryDto) => {
    const queryParams = generateQueryParams({ params: query, isOption: true })

    const res = await apiCall<ResMetadataDto<IProductVariant>>(
      `/product-variants/options?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<IProductVariant>>(res)
  },

  findAllByCampaign: async (campaignId: string, query?: QueryDto) => {
    const queryParams = generateQueryParams({ params: query, isOption: true })

    const res = await apiCall<ResMetadataDto<IProductVariant>>(
      `/product-variants/campaign/${campaignId}?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<IProductVariant>>(res)
  },

  findAll: async (query?: QueryDto) => {
    const queryParams = generateQueryParams({ params: query })

    const res = await apiCall<ResMetadataDto<IProductVariant>>(
      `/product-variants?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<IProductVariant>>(res)
  },

  findOneBySlug: async (slug: string) => {
    const res = await apiCall<IProductVariant>(
      `/product-variants/slug/${slug}`,
      {
        method: "GET",
      }
    )

    return handleResponse<IProductVariant>(res)
  },

  update: async (id: string, payload: UpdateProductVariantDto) => {
    const res = await apiCall(`/product-variants/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse(res)
  },

  delete: async (id: string) => {
    const res = await apiCall(`/product-variants/${id}`, {
      method: "DELETE",
    })

    return handleResponse(res)
  },
}
