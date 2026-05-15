import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/shared/dtos/req/category.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { ICategory } from "@/shared/interfaces/models/category.interface"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const categoryServices = {
  create: async (payload: CreateCategoryDto) => {
    const res = await apiCall<ICategory>("/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<ICategory>(res)
  },

  update: async (id: string, payload: UpdateCategoryDto) => {
    const res = await apiCall<ICategory>(`/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse<ICategory>(res)
  },

  findAll: async (query?: QueryDto) => {
    const queryParams = generateQueryParams(query)

    const res = await apiCall<ResMetadataDto<ICategory>>(
      `/categories?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<ICategory>>(res)
  },

  getTreeData: async (query?: QueryDto) => {
    const queryParams = generateQueryParams(query)

    const res = await apiCall<ICategory[]>(
      `/categories/tree?${queryParams.toString()}`,
      {
        method: "GET",
      }
    )
    return handleResponse<ICategory[]>(res)
  },

  delete: async (id: string) => {
    const res = await apiCall(`/categories/${id}`, {
      method: "DELETE",
    })

    return handleResponse(res)
  },
}
