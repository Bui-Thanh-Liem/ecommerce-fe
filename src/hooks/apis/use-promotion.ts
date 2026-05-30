import { promotionServices } from "@/services/promotion.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"

import {
  CreatePromotionDto,
  UpdatePromotionDto,
} from "@/shared/dtos/req/promotion.dto"
import { IPromotion } from "@/shared/interfaces/models/promotion.interface"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFindAllPromotions = (query?: QueryDto<IPromotion>) => {
  return useQuery({
    queryKey: ["promotions", query ? JSON.stringify(query) : null],
    queryFn: () => promotionServices.findAll(query),
  })
}

export const useCreatePromotion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreatePromotionDto) =>
      promotionServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] })
    },
  })
}

export const useUpdatePromotion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdatePromotionDto
    }) => promotionServices.update(id, payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] })
    },
  })
}

export const useDeletePromotion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (id: string) => promotionServices.delete(id),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] })
    },
  })
}
