import { locationRegionServices } from "@/services/location-region.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateLocationRegionDto,
  UpdateLocationRegionDto,
} from "@/shared/dtos/req/location-region.dto"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFindAllLocationRegions = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["location-regions", JSON.stringify(query)],
    queryFn: () => locationRegionServices.findAll(query),
  })
}

export const useFindOptionsLocationRegions = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["location-regions-options", JSON.stringify(query)],
    queryFn: () => locationRegionServices.findOptions(query),
  })
}

export const useFindTreeDataLocationRegions = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["location-regions-tree"],
    queryFn: () => locationRegionServices.getTreeData(query),
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
      queryClient.invalidateQueries({ queryKey: ["location-regions"] })
      queryClient.invalidateQueries({ queryKey: ["location-regions-options"] })
      queryClient.invalidateQueries({ queryKey: ["location-regions-tree"] })
    },
  })
}

export const useUpdateLocationRegion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({
      id,
      payload,
    }: {
      payload: UpdateLocationRegionDto
      id: string
    }) => locationRegionServices.update(id, payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["location-regions"] })
      queryClient.invalidateQueries({ queryKey: ["location-regions-options"] })
      queryClient.invalidateQueries({ queryKey: ["location-regions-tree"] })
    },
  })
}

export const useDeleteLocationRegions = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (id: string) => locationRegionServices.delete(id),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["location-regions"] })
      queryClient.invalidateQueries({ queryKey: ["location-regions-options"] })
      queryClient.invalidateQueries({ queryKey: ["location-regions-tree"] })
    },
  })
}
