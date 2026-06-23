import { productItemServices } from "@/services/catalog/product-item.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateProductItemDto,
  UpdateProductItemDto,
} from "@/shared/dtos/req/product-item.dto"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const useFindAllProductItems = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["product-items"],
    queryFn: () => productItemServices.findAll(query),
  })
}

export const useCreateProductItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateProductItemDto) =>
      productItemServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-items"] })
    },
  })
}

export const useUpdateProductItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({
      id,
      payload,
    }: {
      payload: UpdateProductItemDto
      id: string
    }) => productItemServices.update(id, payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-items"] })
    },
  })
}

export const useDeleteProductItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (id: string) => productItemServices.delete(id),

    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["product-variants"] })
      queryClient.invalidateQueries({ queryKey: ["product-variant", id] })
    },

    onError: () => {},
  })
}
