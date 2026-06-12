import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  LoginCustomerDto,
  UpdateCustomerDto,
  VerifyLoginOtpCustomerDto,
} from "@/shared/dtos/req/customer.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { ResLoginCustomerDto } from "@/shared/dtos/res/sign-in.dto"
import { ICustomer } from "@/shared/interfaces/models/customer/customer.interface"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const customerServices = {
  login: async (payload: LoginCustomerDto) => {
    const res = await apiCall<ICustomer>("/customers/login", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<ICustomer>(res)
  },

  verifyLoginOtp: async (payload: VerifyLoginOtpCustomerDto) => {
    const res = await apiCall<ResLoginCustomerDto>(
      "/customers/verify-login-otp",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    )

    return handleResponse<ResLoginCustomerDto>(res)
  },

  findAll: async (query?: QueryDto<ICustomer>) => {
    const queryParams = generateQueryParams(query)

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
}
