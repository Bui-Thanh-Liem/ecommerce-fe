import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateProductNavbarDto,
  UpdateProductNavbarDto,
} from "@/shared/dtos/req/product-navbar.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { IProductNavbar } from "@/shared/interfaces/models/navbar.interface"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const productNavbarServices = {
  create: async (payload: CreateProductNavbarDto) => {
    const res = await apiCall<IProductNavbar>("/product-navbars", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<IProductNavbar>(res)
  },

  findAll: async (query?: QueryDto<IProductNavbar>) => {
    const queryParams = generateQueryParams(query)

    const res = await apiCall<ResMetadataDto<IProductNavbar>>(
      `/product-navbars?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<IProductNavbar>>(res)
  },

  update: async (id: string, payload: UpdateProductNavbarDto) => {
    const res = await apiCall<IProductNavbar>(`/product-navbars/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse<IProductNavbar>(res)
  },

  delete: async (id: string) => {
    const res = await apiCall(`/product-navbars/${id}`, {
      method: "DELETE",
    })

    return handleResponse(res)
  },
}
