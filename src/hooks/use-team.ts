import { teamServices } from "@/services/team.service"
import { CreateStoreDto } from "@/shared/dtos/req/create-store.dto"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFindAllTeams = ({ storeId }: { storeId?: string }) => {
  return useQuery({
    queryKey: ["teams"],
    queryFn: () => teamServices.findAll({ storeId }),
  })
}

export const useCreateTeam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateStoreDto) => teamServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] })
    },
  })
}
