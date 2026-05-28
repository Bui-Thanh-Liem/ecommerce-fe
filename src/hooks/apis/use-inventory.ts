import { inventoryServices } from "@/services/inventory.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateInventoryDto,
  UpdateInventoryDto,
} from "@/shared/dtos/req/inventory.dto"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const useFindAllInventories = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["inventories"],
    queryFn: () => inventoryServices.findAll(query),
  })
}

export const useFindOptionsInventories = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["inventory-options"],
    queryFn: () => inventoryServices.findOptions(query),
  })
}

export const useCreateInventory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateInventoryDto) =>
      inventoryServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] })
    },
  })
}

export const useUpdateInventory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({
      id,
      payload,
    }: {
      payload: UpdateInventoryDto
      id: string
    }) => inventoryServices.update(id, payload),

    //
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] })
      queryClient.invalidateQueries({ queryKey: ["inventory", variables.id] })
    },
  })
}

export const useDeleteInventory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (id: string) => inventoryServices.delete(id),

    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["inventory", id] })
      queryClient.invalidateQueries({ queryKey: ["inventories"] })
    },

    onError: () => {},
  })
}
