import { brandServices } from "@/services/brand.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import { CreateBrandDto, UpdateBrandDto } from "@/shared/dtos/req/brand.dto"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFindAllBrands = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["brands", JSON.stringify(query)],
    queryFn: () => brandServices.findAll(query),
  })
}

export const useFindOptionsBrands = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["brands-options", JSON.stringify(query)],
    queryFn: () => brandServices.findOptions(query),
  })
}

export const useCreateBrand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateBrandDto) => brandServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      queryClient.invalidateQueries({ queryKey: ["brands-options"] })
    },
  })
}

export const useUpdateBrand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({ id, payload }: { payload: UpdateBrandDto; id: string }) =>
      brandServices.update(id, payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      queryClient.invalidateQueries({ queryKey: ["brands-options"] })
    },
  })
}

export const useDeleteBrand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (id: string) => brandServices.delete(id),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      queryClient.invalidateQueries({ queryKey: ["brands-options"] })
    },
  })
}
