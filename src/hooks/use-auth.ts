import { authServices } from "@/services/auth.service"
import { SignInDto } from "@/shared/dtos/req/sign-in.dto"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useSignIn = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: SignInDto) => authServices.signIn(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sign-in"] })
    },
  })
}
