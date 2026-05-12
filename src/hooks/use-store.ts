import { storeServices } from "@/services/store.service"
import { CreateStoreDto, UpdateStoreDto } from "@/shared/dtos/req/store.dto"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFindAllStores = () => {
  return useQuery({
    queryKey: ["stores"],
    queryFn: storeServices.findAll,
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
      queryClient.invalidateQueries({ queryKey: ["staffs"] })
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
      queryClient.invalidateQueries({ queryKey: ["staffs"] })
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
      queryClient.invalidateQueries({ queryKey: ["staffs"] })
    },
  })
}
