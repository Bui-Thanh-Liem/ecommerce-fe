import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { customerServices } from "@/services/customer/customer.service"
import {
  LoginCustomerDto,
  UpdateCustomerDto,
  VerifyLoginOtpCustomerDto,
} from "@/shared/dtos/req/customer.dto"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import { useCustomerContext } from "@/context/customer.context"
import { deleteStorage } from "@/utils/delete-storage.util"

export const useLoginCustomer = () => {
  return useMutation({
    //
    mutationFn: (payload: LoginCustomerDto) => customerServices.login(payload),

    //
    onSuccess: () => {},
  })
}

export const useSignOutCustomer = () => {
  const { clearCustomer } = useCustomerContext()

  return useMutation({
    //
    mutationFn: () => customerServices.signout(),

    //
    onSuccess: (data) => {
      //
      if (data?.statusCode === 201) {
        deleteStorage("customer") // Xóa token, customer info, etc. trong localStorage/sessionStorage
        clearCustomer() // Clear customer context
      }
    },
  })
}

export const useVerifyLoginOtpCustomer = () => {
  const { setCustomer } = useCustomerContext()

  return useMutation({
    //
    mutationFn: (payload: VerifyLoginOtpCustomerDto) =>
      customerServices.verifyLoginOtp(payload),

    //
    onSuccess: (data) => {
      console.log("data ::", data)

      //
      if (data?.statusCode === 201) {
        const customer = data.metadata!.customer
        setCustomer(customer)
      }
    },
  })
}

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCustomerDto }) =>
      customerServices.update(id, payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
    },
  })
}

export const useUpdateProfileCustomer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({ payload }: { payload: UpdateCustomerDto }) =>
      customerServices.updateProfile(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
    },
  })
}

export const useFindAllCustomers = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: () => customerServices.findAll(query),
  })
}
