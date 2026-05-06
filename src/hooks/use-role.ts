import { roleServices } from "@/services/role.service"
import { CreateRoleDto, UpdateRoleDto } from "@/shared/dtos/req/role.dto"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFindAllRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: roleServices.findAll,
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
