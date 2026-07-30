import { QueryDto } from "@/shared/dtos/common/query.dto"
import { UpdateCustomerDto } from "@/shared/dtos/req/customer.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { ICustomer } from "@/shared/interfaces/models/customer/customer.interface"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const customerServices = {
  findAll: async (query?: QueryDto<ICustomer>) => {
    const queryParams = generateQueryParams({ params: query })

    const res = await apiCall<ResMetadataDto<ICustomer>>(
      `/customers?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<ICustomer>>(res)
  },

  update: async (id: string, payload: UpdateCustomerDto) => {
    const res = await apiCall<ICustomer>(`/customers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse<ICustomer>(res)
  },

  updateProfile: async (payload: UpdateCustomerDto) => {
    const res = await apiCall<ICustomer>(`/customers/update-profile`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse<ICustomer>(res)
  },
}
