import {
  SigninCustomerDto,
  VerifyLoginOtpCustomerDto,
} from "@/shared/dtos/req/customer.dto"
import { ResLoginCustomerDto } from "@/shared/dtos/res/sign-in.dto"
import { apiCall } from "@/utils/call-api.util"
import { handleResponse } from "@/utils/handle-response.util"

const route = "/customer-auth"
export const customerAuthServices = {
  signIn: async (payload: SigninCustomerDto) => {
    const res = await apiCall(`${route}/signin`, {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse(res)
  },

  refreshToken: async () => {
    const res = await apiCall<boolean>(`${route}/refresh-token`, {
      method: "POST",
    })
    return handleResponse<boolean>(res)
  },

  verifyLoginOtp: async (payload: VerifyLoginOtpCustomerDto) => {
    const res = await apiCall<ResLoginCustomerDto>(
      `${route}/verify-login-otp`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    )

    return handleResponse<ResLoginCustomerDto>(res)
  },

  signout: async () => {
    const res = await apiCall(`${route}/signout`, {
      method: "POST",
    })

    return handleResponse(res)
  },
}
