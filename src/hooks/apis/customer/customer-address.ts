import { customerAddressServices } from "@/services/customer/customer-address.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateCustomerAddressDto,
  UpdateCustomerAddressDto,
} from "@/shared/dtos/req/customer-address.dto"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useCreateCustomerAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateCustomerAddressDto) =>
      customerAddressServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-addresses"] })
    },
  })
}

export const useUpdateCustomerAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateCustomerAddressDto
    }) => customerAddressServices.update(id, payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-addresses"] })
    },
  })
}

export const useDeleteCustomerAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (id: string) => customerAddressServices.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-addresses"] })
    },
    onError: () => {},
  })
}

export const useFindAllCustomerAddresses = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["customer-addresses"],
    queryFn: () => customerAddressServices.findAll(query),
  })
}

export const useFindAllOwnedCustomerAddresses = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["customer-addresses"],
    queryFn: () => customerAddressServices.findAllOwned(query),
  })
}
