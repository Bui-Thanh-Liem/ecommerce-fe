import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { customerServices } from "@/services/customer/customer.service"
import { UpdateCustomerDto } from "@/shared/dtos/req/customer.dto"
import { QueryDto } from "@/shared/dtos/common/query.dto"

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
