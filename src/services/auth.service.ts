import { SignInDto } from "@/shared/dtos/req/sign-in.dto"
import { ResSignInStaffDto } from "@/shared/dtos/res/sign-in.dto"
import { apiCall } from "@/utils/call-api.util"
import { handleResponse } from "@/utils/handle-response.util"

export const authServices = {
  signIn: async (payload: SignInDto) => {
    const res = await apiCall<ResSignInStaffDto>("/auth/signin", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<ResSignInStaffDto>(res)
  },

  whoami: async () => {
    const res = await apiCall("/auth/whoami", {
      method: "GET",
    })

    return handleResponse(res)
  },

  signout: async () => {
    const res = await apiCall("/auth/signout", {
      method: "POST",
    })

    return handleResponse(res)
  },
}
