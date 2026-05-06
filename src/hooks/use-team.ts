import { teamServices } from "@/services/team.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import { CreateTeamDto } from "@/shared/dtos/req/team.dto"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFindAllTeams = (query: QueryDto) => {
  return useQuery({
    queryKey: ["teams", JSON.stringify(query)],
    queryFn: () => teamServices.findAll(query),
  })
}

export const useCreateTeam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateTeamDto) => teamServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] })
    },
  })
}
