import { teamCategoryServices } from "@/services/team-category.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateTeamCategoryDto,
  UpdateTeamCategoryDto,
} from "@/shared/dtos/req/team-category.dto"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFindAllTeamCategories = (query: QueryDto) => {
  return useQuery({
    queryKey: ["team-categories", JSON.stringify(query)],
    queryFn: () => teamCategoryServices.findAll(query),
  })
}

export const useCreateTeamCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateTeamCategoryDto) =>
      teamCategoryServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-categories"] })
    },
  })
}

export const useUpdateTeamCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({
      id,
      payload,
    }: {
      payload: UpdateTeamCategoryDto
      id: string
    }) => teamCategoryServices.update(id, payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-categories"] })
    },
  })
}

export const useDeleteTeamCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (id: string) => teamCategoryServices.delete(id),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-categories"] })
    },
  })
}
