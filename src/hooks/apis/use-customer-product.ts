import { customerProductServices } from "@/services/customer-product.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import { CreateCustomerProductDto } from "@/shared/dtos/req/customer-product.dto"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const useFindAllCustomerProducts = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["customer-products"],
    queryFn: () => customerProductServices.findAll(query),
  })
}

export const useFindOptionsCustomerProducts = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["customer-products", "options"],
    queryFn: () => customerProductServices.findOptions(query),
  })
}

export const useCreateCustomerProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateCustomerProductDto) =>
      customerProductServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-products"] })
    },
  })
}

export const useDeleteCustomerProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (id: string) => customerProductServices.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-products"] })
    },
    onError: () => {},
  })
}
