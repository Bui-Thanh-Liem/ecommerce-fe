import { useMutation } from "@tanstack/react-query"
import { deleteStorage } from "@/utils/delete-storage.util"
import { customerAuthServices } from "@/services/auth/customer-auth.service"
import {
  SigninCustomerDto,
  VerifyLoginOtpCustomerDto,
} from "@/shared/dtos/req/customer.dto"
import { useRouter } from "next/navigation"
import { useCustomerContext } from "@/context/customer.context"

export const useSigninCustomer = () => {
  return useMutation({
    //
    mutationFn: (payload: SigninCustomerDto) =>
      customerAuthServices.signIn(payload),

    //
    onSuccess: () => {},
  })
}

export const useRefreshToken = () => {
  return useMutation({
    //
    mutationFn: () => customerAuthServices.refreshToken(),

    //
    onSuccess: () => {},
    onError: () => {},
  })
}

export const useVerifyLoginOtpCustomer = () => {
  const { setCustomer } = useCustomerContext()

  return useMutation({
    //
    mutationFn: (payload: VerifyLoginOtpCustomerDto) =>
      customerAuthServices.verifyLoginOtp(payload),

    //
    onSuccess: (data) => {
      //
      if (data?.statusCode === 201) {
        const customer = data.metadata!.customer
        setCustomer(customer)
      }
    },
  })
}

export const useSignOutCustomer = () => {
  const router = useRouter()
  const { clearCustomer } = useCustomerContext()

  return useMutation({
    //
    mutationFn: () => customerAuthServices.signout(),

    //
    onSuccess: (data) => {
      //
      if (data?.statusCode === 201) {
        deleteStorage("customer") // Xóa token, customer info, etc. trong localStorage/sessionStorage
        clearCustomer() // Clear customer context
        router.replace("/customer/login") // Chuyển hướng về trang login
      }
    },
  })
}
