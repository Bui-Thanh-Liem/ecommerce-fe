import { categoryPromotionServices } from "@/services/category-promotion.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateCategoryPromotionDto,
  UpdateCategoryPromotionDto,
} from "@/shared/dtos/req/category-promotion.dto"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFindAllCategoryPromotions = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["category-promotions", JSON.stringify(query)],
    queryFn: () => categoryPromotionServices.findAll(query),
  })
}

export const useFindOptionsCategoryPromotions = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["category-promotions-options", JSON.stringify(query)],
    queryFn: () => categoryPromotionServices.findOptions(query),
  })
}

export const useFindTreeDataCategoryPromotions = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["category-promotions-tree"],
    queryFn: () => categoryPromotionServices.getTreeData(query),
  })
}

export const useCreateCategoryPromotion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateCategoryPromotionDto) =>
      categoryPromotionServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-promotions"] })
    },
  })
}

export const useUpdateCategoryPromotion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({
      id,
      payload,
    }: {
      payload: UpdateCategoryPromotionDto
      id: string
    }) => categoryPromotionServices.update(id, payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-promotions"] })
    },
  })
}

export const useDeleteCategoryPromotion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (id: string) => categoryPromotionServices.delete(id),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-promotions"] })
    },
  })
}
