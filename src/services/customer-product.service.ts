import { QueryDto } from "@/shared/dtos/common/query.dto"
import { CreateCustomerProductDto } from "@/shared/dtos/req/customer-product.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { ICustomerProduct } from "@/shared/interfaces/models/customer-product.interface"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const customerProductServices = {
  create: async (payload: CreateCustomerProductDto) => {
    const res = await apiCall("/customer-products", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse(res)
  },

  findAll: async (query?: QueryDto) => {
    const queryParams = generateQueryParams(query)

    const res = await apiCall<ResMetadataDto<ICustomerProduct>>(
      `/customer-products?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<ICustomerProduct>>(res)
  },

  findOptions: async (query?: QueryDto) => {
    const queryParams = generateQueryParams(query)

    const res = await apiCall<ResMetadataDto<ICustomerProduct>>(
      `/customer-products/options?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<ICustomerProduct>>(res)
  },

  delete: async (id: string) => {
    const res = await apiCall(`/customer-products/${id}`, {
      method: "DELETE",
    })

    return handleResponse(res)
  },
}
