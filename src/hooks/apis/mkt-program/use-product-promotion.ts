import { productPromotionServices } from "@/services/mkt-program/product-promotion.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateProductPromotionDto,
  UpdateProductPromotionDto,
} from "@/shared/dtos/req/product-promotion.dto"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFindAllProductPromotions = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["product-promotions", JSON.stringify(query)],
    queryFn: () => productPromotionServices.findAll(query),
  })
}

export const useFindOptionsProductPromotions = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["product-promotions-options", JSON.stringify(query)],
    queryFn: () => productPromotionServices.findOptions(query),
  })
}

export const useFindTreeDataProductPromotions = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["product-promotions-tree"],
    queryFn: () => productPromotionServices.getTreeData(query),
  })
}

export const useCreateProductPromotion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateProductPromotionDto) =>
      productPromotionServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-promotions"] })
      queryClient.invalidateQueries({ queryKey: ["product-promotions-tree"] })
      queryClient.invalidateQueries({ queryKey: ["product-promotions-options"] })
    },
  })
}

export const useUpdateProductPromotion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({
      id,
      payload,
    }: {
      payload: UpdateProductPromotionDto
      id: string
    }) => productPromotionServices.update(id, payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-promotions"] })
      queryClient.invalidateQueries({ queryKey: ["product-promotions-tree"] })
      queryClient.invalidateQueries({ queryKey: ["product-promotions-options"] })
    },
  })
}

export const useDeleteProductPromotion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (id: string) => productPromotionServices.delete(id),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-promotions"] })
      queryClient.invalidateQueries({ queryKey: ["product-promotions-tree"] })
      queryClient.invalidateQueries({ queryKey: ["product-promotions-options"] })
    },
  })
}
