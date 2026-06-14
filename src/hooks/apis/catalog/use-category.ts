import { categoryServices } from "@/services/catalog/category.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/shared/dtos/req/category.dto"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFindAllCategories = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["categories", JSON.stringify(query)],
    queryFn: () => categoryServices.findAll(query),
  })
}

export const useFindOptionsCategories = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["categories-options", JSON.stringify(query)],
    queryFn: () => categoryServices.findOptions(query),
  })
}

export const useFindTreeDataCategories = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["categories-tree"],
    queryFn: () => categoryServices.getTreeData(query),
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateCategoryDto) =>
      categoryServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["categories-tree"] })
      queryClient.invalidateQueries({ queryKey: ["categories-options"] })
    },
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({ id, payload }: { payload: UpdateCategoryDto; id: string }) =>
      categoryServices.update(id, payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["categories-tree"] })
      queryClient.invalidateQueries({ queryKey: ["categories-options"] })
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (id: string) => categoryServices.delete(id),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["categories-tree"] })
      queryClient.invalidateQueries({ queryKey: ["categories-options"] })
    },
  })
}
