import { locationRegionServices } from "@/services/location-region.service"
import { CreateLocationRegionDto } from "@/shared/dtos/req/location-region.dto"
import { LocationRegionType } from "@/shared/enums/location-region-type.enum"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFindAllLocationRegions = () => {
  return useQuery({
    queryKey: ["location-regions"],
    queryFn: locationRegionServices.findAll,
  })
}

export const useFindTreeDataByRootId = (id: string) => {
  return useQuery({
    queryKey: ["location-regions-tree", id],
    queryFn: () => locationRegionServices.getTreeDataByRootId(id),
  })
}

export const useFindRegions = (type: LocationRegionType, parentId?: string) => {
  return useQuery({
    queryKey: ["location-regions-tree", parentId, type],
    queryFn: () => locationRegionServices.getRegions(type, parentId),
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
