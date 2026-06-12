import { staffServices } from "@/services/management/staff.service"
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
    queryKey: ["staffs-options"],
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
      queryClient.invalidateQueries({ queryKey: ["staffs-options"] })
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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["staffs"] })
      queryClient.invalidateQueries({ queryKey: ["staffs-options"] })
      queryClient.invalidateQueries({ queryKey: ["staff", variables.id] })
    },
  })
}

export const useDeleteStaff = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (id: string) => staffServices.delete(id),

    //
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["staff", id] })
      queryClient.invalidateQueries({ queryKey: ["staffs"] })
      queryClient.invalidateQueries({ queryKey: ["staffs-options"] })
    },
  })
}
