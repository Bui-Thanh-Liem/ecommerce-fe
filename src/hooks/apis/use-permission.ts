import { permissionServices } from "@/services/permission.service"
import { UpdatePermissionDto } from "@/shared/dtos/req/permission.dto"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFindAllPermissions = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: permissionServices.findAll,
  })
}

export const useUpdatePermission = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdatePermissionDto
    }) => permissionServices.update(id, payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] })
      queryClient.invalidateQueries({ queryKey: ["permissions"] })
    },
  })
}
