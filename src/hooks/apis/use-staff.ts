import { staffServices } from "@/services/staff.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import { CreateStaffDto, UpdateStaffDto } from "@/shared/dtos/req/staff.dto"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const useFindAllStaffs = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["staffs"],
    queryFn: () => staffServices.findAll(query),
  })
}

export const useFindOptionsStaffs = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["staffs"],
    queryFn: () => staffServices.findOptions(query),
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

export const useDeleteStaff = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (id: string) => staffServices.delete(id),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffs"] })
    },
  })
}
