import { locationRegionServices } from "@/services/location-region.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateLocationRegionDto,
  UpdateLocationRegionDto,
} from "@/shared/dtos/req/location-region.dto"
import { ILocationRegion } from "@/shared/interfaces/models/location-region.interface"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFindAllLocationRegions = (
  query?: QueryDto<ILocationRegion>
) => {
  return useQuery({
    queryKey: ["location-regions", query ? JSON.stringify(query) : null],
    queryFn: () => locationRegionServices.findAll(query),
  })
}

export const useFindTreeData = (query?: QueryDto) => {
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
      queryClient.invalidateQueries({ queryKey: ["location-regions-tree"] })
    },
  })
}
