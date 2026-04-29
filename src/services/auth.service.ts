import { SignInDto } from "@/shared/dtos/req/sign-in.dto"
import { ResSignInDto } from "@/shared/dtos/res/sign-in.dto"
import { apiCall } from "@/utils/call-api.util"
import { toast } from "sonner"

export const authServices = {
  signIn: async (payload: SignInDto) => {
    const res = await apiCall<ResSignInDto>("/auth/signin", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    if (res.statusCode === 201) {
      toast.success(res.message || "Signed in successfully")
      return res
    } else {
      toast.error(res.message || "Failed to sign in")
      return null
    }
  },
}
