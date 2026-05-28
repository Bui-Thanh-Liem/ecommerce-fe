import { roleServices } from "@/services/role.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import { CreateRoleDto, UpdateRoleDto } from "@/shared/dtos/req/role.dto"
import { IRole } from "@/shared/interfaces/models/role.interface"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFindAllRoles = (query?: QueryDto<IRole>) => {
  return useQuery({
    queryKey: ["roles", query ? JSON.stringify(query) : null],
    queryFn: () => roleServices.findAll(query),
  })
}

export const useFindOptionsRoles = (query?: QueryDto<IRole>) => {
  return useQuery({
    queryKey: ["roles", query ? JSON.stringify(query) : null],
    queryFn: () => roleServices.findOptions(query),
  })
}

export const useCreateRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateRoleDto) => roleServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] })
    },
  })
}

export const useUpdateRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({ id, payload }: { payload: UpdateRoleDto; id: string }) =>
      roleServices.update(id, payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] })
    },
  })
}
