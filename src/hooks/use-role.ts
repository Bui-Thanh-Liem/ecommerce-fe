import { roleServices } from "@/services/role.service"
import { CreateRoleDto } from "@/shared/dtos/req/create-role.dto"
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
