import { productVariantServices } from "@/services/catalog/product-variant.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateProductVariantDto,
  UpdateProductVariantDto,
} from "@/shared/dtos/req/product-variant.dto"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const useFindAllProductVariants = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["product-variants"],
    queryFn: () => productVariantServices.findAll(query),
  })
}

export const useFindOptionsProductVariants = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["product-variants-options"],
    queryFn: () => productVariantServices.findOptions(query),
  })
}

export const useFindAllByCampaignProductVariants = (
  campaignId: string,
  query?: QueryDto
) => {
  return useQuery({
    queryKey: ["product-variants-campaign", campaignId],
    queryFn: () => productVariantServices.findAllByCampaign(campaignId, query),
  })
}

export const useCreateProductVariant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateProductVariantDto) =>
      productVariantServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-variants"] })
      queryClient.invalidateQueries({ queryKey: ["product-variants-options"] })
    },
  })
}

export const useUpdateProductVariant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({
      id,
      payload,
    }: {
      payload: UpdateProductVariantDto
      id: string
    }) => productVariantServices.update(id, payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-variants"] })
      queryClient.invalidateQueries({ queryKey: ["product-variants-options"] })
    },
  })
}

export const useDeleteProductVariant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (id: string) => productVariantServices.delete(id),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-variants"] })
      queryClient.invalidateQueries({ queryKey: ["product-variants-options"] })
    },
  })
}
