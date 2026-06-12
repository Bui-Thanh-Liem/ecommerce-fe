import { QueryDto } from "@/shared/dtos/common/query.dto"
import { CreateBrandDto, UpdateBrandDto } from "@/shared/dtos/req/brand.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { IBrand } from "@/shared/interfaces/models/catalog/brand.interface"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const brandServices = {
  create: async (payload: CreateBrandDto) => {
    const res = await apiCall<IBrand>("/brands", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<IBrand>(res)
  },

  update: async (id: string, payload: UpdateBrandDto) => {
    const res = await apiCall(`/brands/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse(res)
  },

  findAll: async (query?: QueryDto) => {
    const queryParams = generateQueryParams(query)

    const res = await apiCall<ResMetadataDto<IBrand>>(
      `/brands?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<IBrand>>(res)
  },

  findOptions: async (query?: QueryDto) => {
    const queryParams = generateQueryParams(query)

    const res = await apiCall<ResMetadataDto<IBrand>>(
      `/brands/options?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<IBrand>>(res)
  },

  delete: async (id: string) => {
    const res = await apiCall(`/brands/${id}`, {
      method: "DELETE",
    })

    return handleResponse(res)
  },
}
