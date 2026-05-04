import { locationRegionServices } from "@/services/location-region.service"
import { CreateLocationRegionDto } from "@/shared/dtos/req/create-location-region.dto"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFindAllLocationRegions = () => {
  return useQuery({
    queryKey: ["location-regions"],
    queryFn: locationRegionServices.findAll,
  })
}

export const useGetTreeDataByRootId = (id: string) => {
  return useQuery({
    queryKey: ["location-regions-tree", id],
    queryFn: () => locationRegionServices.getTreeDataByRootId(id),
  })
}

export const useCreateLocationRegion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateLocationRegionDto) =>
      locationRegionServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["location-regions-tree"] })
    },
  })
}
