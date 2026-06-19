import { popularSearchServices } from "@/services/store-front/popular-search.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreatePopularSearchDto,
  UpdatePopularSearchDto,
} from "@/shared/dtos/req/popular-search.dto"
import { IMenu } from "@/shared/interfaces/models/store-front/menu.interface"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFindAllPopularSearches = (query?: QueryDto<IMenu>) => {
  return useQuery({
    queryKey: ["popular-searches", query ? JSON.stringify(query) : null],
    queryFn: () => popularSearchServices.findAll(query),
  })
}

export const useFindOptionsPopularSearches = (query?: QueryDto) => {
  return useQuery({
    queryKey: [
      "popular-searches-options",
      query ? JSON.stringify(query) : null,
    ],
    queryFn: () => popularSearchServices.findOptions(query),
  })
}

export const useCreatePopularSearch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreatePopularSearchDto) =>
      popularSearchServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["popular-searches"] })
      queryClient.invalidateQueries({ queryKey: ["popular-searches-options"] })
    },
  })
}

export const useUpdatePopularSearch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({
      id,
      payload,
    }: {
      payload: UpdatePopularSearchDto
      id: string
    }) => popularSearchServices.update(id, payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["popular-searches"] })
      queryClient.invalidateQueries({ queryKey: ["popular-searches-options"] })
    },
  })
}

export const useDeletePopularSearch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (id: string) => popularSearchServices.delete(id),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["popular-searches"] })
      queryClient.invalidateQueries({ queryKey: ["popular-searches-options"] })
    },
  })
}
