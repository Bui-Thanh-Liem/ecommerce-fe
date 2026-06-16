import { storeFrontConfigServices } from "@/services/store-front/store-front-config.service"
import {
  CreateStoreFrontConfigDto,
  UpdateStoreFrontConfigDto,
} from "@/shared/dtos/req/store-front-config.dto"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFindStoreFrontConfig = () => {
  return useQuery({
    queryKey: ["store-front-configs"],
    queryFn: () => storeFrontConfigServices.findConfig(),
  })
}

export const useCreateStoreFrontConfig = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateStoreFrontConfigDto) =>
      storeFrontConfigServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-front-configs"] })
    },
  })
}

export const useUpdateStoreFrontConfig = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateStoreFrontConfigDto
    }) => storeFrontConfigServices.update(id, payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-front-configs"] })
    },
  })
}
