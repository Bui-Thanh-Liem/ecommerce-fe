import { SignInDto } from "@/shared/dtos/req/sign-in.dto"
import { ResSignInDto } from "@/shared/dtos/res/sign-in.dto"
import { apiCall } from "@/utils/call-api.util"
import { handleResponse } from "@/utils/handle-response.util"

export const authServices = {
  signIn: async (payload: SignInDto) => {
    const res = await apiCall<ResSignInDto>("/auth/signin", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<ResSignInDto>(res)
  },

  whoami: async () => {
    const res = await apiCall("/auth/whoami", {
      method: "GET",
    })

    return handleResponse(res)
  },
}
