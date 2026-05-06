import { storeServices } from "@/services/store.service"
import { CreateStoreDto } from "@/shared/dtos/req/store.dto"
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
    },
  })
}
