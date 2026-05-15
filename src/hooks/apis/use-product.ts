import { productServices } from "@/services/product.service"
import {
  CreateProductDto,
  UpdateProductDto,
} from "@/shared/dtos/req/product.dto"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const useFindAllProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: productServices.findAll,
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateProductDto) => productServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({ id, payload }: { payload: UpdateProductDto; id: string }) =>
      productServices.update(id, payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (id: string) => productServices.delete(id),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}
