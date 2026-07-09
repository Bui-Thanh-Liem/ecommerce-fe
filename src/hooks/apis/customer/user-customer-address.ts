import { customerAddressServices } from "@/services/customer/customer-address.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateCustomerAddressDto,
  UpdateCustomerAddressDto,
} from "@/shared/dtos/req/customer-address.dto"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFindAllCustomerAddresses = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["customer-addresses"],
    queryFn: () => customerAddressServices.findAll(query),
  })
}

export const useFindOneIsDefaultCustomerAddress = () => {
  return useQuery({
    queryKey: ["customer-addresses-default"],
    queryFn: () => customerAddressServices.findOneIsDefault(),
  })
}

export const useCreateCustomerAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateCustomerAddressDto) =>
      customerAddressServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-addresses-owned"] })
    },
  })
}

export const useUpdateOwnedCustomerAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateCustomerAddressDto
    }) => customerAddressServices.updateOwned(id, payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-addresses-owned"] })
    },
  })
}

export const useDeleteOwnedCustomerAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (id: string) => customerAddressServices.deleteOwned(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-addresses-owned"] })
    },
    onError: () => {},
  })
}

export const useFindAllOwnedCustomerAddresses = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["customer-addresses-owned"],
    queryFn: () => customerAddressServices.findAllOwned(query),
  })
}
