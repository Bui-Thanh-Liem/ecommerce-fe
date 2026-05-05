import { staffServices } from "@/services/staff.service"
import {
  CreateStaffDto,
  UpdateStaffDto,
} from "@/shared/dtos/req/create-staff.dto"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const useFindAllStaffs = () => {
  return useQuery({
    queryKey: ["staffs"],
    queryFn: staffServices.findAll,
  })
}

export const useCreateStaff = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateStaffDto) => staffServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffs"] })
    },
  })
}

export const useUpdateStaff = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({ id, payload }: { payload: UpdateStaffDto; id: string }) =>
      staffServices.update(id, payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffs"] })
    },
  })
}
