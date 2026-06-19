import { menuServices } from "@/services/store-front/menu.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import { CreateMenuDto, UpdateMenuDto } from "@/shared/dtos/req/menu.dto"
import { IMenu } from "@/shared/interfaces/models/store-front/menu.interface"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFindAllMenus = (query?: QueryDto<IMenu>) => {
  return useQuery({
    queryKey: ["menus", query ? JSON.stringify(query) : null],
    queryFn: () => menuServices.findAll(query),
  })
}

export const useFindOptionsMenus = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["menus-options", query ? JSON.stringify(query) : null],
    queryFn: () => menuServices.findOptions(query),
  })
}

export const useCreateMenu = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateMenuDto) => menuServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] })
      queryClient.invalidateQueries({ queryKey: ["menus-options"] })
    },
  })
}

export const useUpdateMenu = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({ id, payload }: { payload: UpdateMenuDto; id: string }) =>
      menuServices.update(id, payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] })
      queryClient.invalidateQueries({ queryKey: ["menus-options"] })
    },
  })
}

export const useDeleteMenu = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (id: string) => menuServices.delete(id),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] })
      queryClient.invalidateQueries({ queryKey: ["menus-options"] })
    },
  })
}
