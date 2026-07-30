import { SignInDto } from "@/shared/dtos/req/sign-in.dto"
import { ResSignInStaffDto } from "@/shared/dtos/res/sign-in.dto"
import { apiCall } from "@/utils/call-api.util"
import { handleResponse } from "@/utils/handle-response.util"

const route = "/staff-auth"
export const staffAuthServices = {
  signIn: async (payload: SignInDto) => {
    const res = await apiCall<ResSignInStaffDto>(`${route}/signin`, {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<ResSignInStaffDto>(res)
  },

  refreshToken: async () => {
    const res = await apiCall<boolean>(`${route}/refresh-token`, {
      method: "POST",
    })
    return handleResponse<boolean>(res)
  },

  whoami: async () => {
    const res = await apiCall(`${route}/whoami`, {
      method: "GET",
    })

    return handleResponse(res)
  },

  signout: async () => {
    const res = await apiCall(`${route}/signout`, {
      method: "POST",
    })

    return handleResponse(res)
  },
}
