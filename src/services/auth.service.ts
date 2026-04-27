import { SignInDto } from "@/shared/dtos/req/sign-in.dto";
import { ResSignInDto } from "@/shared/dtos/res/sign-in.dto";
import { apiCall } from "@/utils/call-api.util";

export const authServices =  {
  signIn: async (payload: SignInDto) => {
    const res = await apiCall<ResSignInDto>("/auth/sign-in", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return res;
  }
}