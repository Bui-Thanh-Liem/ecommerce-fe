import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateCustomerAddressDto,
  UpdateCustomerAddressDto,
} from "@/shared/dtos/req/customer-address.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { ICustomerAddress } from "@/shared/interfaces/models/customer/customer-address.interface"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const customerAddressServices = {
  create: async (payload: CreateCustomerAddressDto) => {
    const res = await apiCall("/customer-address", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse(res)
  },

  update: async (id: string, payload: UpdateCustomerAddressDto) => {
    const res = await apiCall(`/customer-address/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse(res)
  },

  findAll: async (query?: QueryDto) => {
    const queryParams = generateQueryParams({ params: query })

    const res = await apiCall<ResMetadataDto<ICustomerAddress>>(
      `/customer-address?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<ICustomerAddress>>(res)
  },

  findAllOwned: async (query?: QueryDto) => {
    const queryParams = generateQueryParams({ params: query })

    const res = await apiCall<ResMetadataDto<ICustomerAddress>>(
      `/customer-address/owned?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<ICustomerAddress>>(res)
  },

  delete: async (id: string) => {
    const res = await apiCall(`/customer-address/${id}`, {
      method: "DELETE",
    })

    return handleResponse(res)
  },
}
