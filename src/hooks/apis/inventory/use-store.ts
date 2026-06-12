import { storeServices } from "@/services/inventory/store.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import { CreateStoreDto, UpdateStoreDto } from "@/shared/dtos/req/store.dto"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFindAllStores = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["stores"],
    queryFn: () => storeServices.findAll(query),
  })
}

export const useFindOptionsStores = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["stores-options"],
    queryFn: () => storeServices.findOptions(query),
  })
}

export const useCreateStore = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateStoreDto) => storeServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] })
      queryClient.invalidateQueries({ queryKey: ["stores-options"] })
    },
  })
}

export const useUpdateStore = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: { id: string; payload: UpdateStoreDto }) =>
      storeServices.update(payload.id, payload.payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] })
      queryClient.invalidateQueries({ queryKey: ["stores-options"] })
    },
  })
}

export const useDeleteStore = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (id: string) => storeServices.delete(id),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] })
      queryClient.invalidateQueries({ queryKey: ["stores-options"] })
    },
  })
}
