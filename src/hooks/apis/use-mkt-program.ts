import { mktProgramServices } from "@/services/mkt-program.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateMktProgramDto,
  UpdateMktProgramDto,
} from "@/shared/dtos/req/mkt-program.dto"
import { IMarketingProgram } from "@/shared/interfaces/models/marketing-program.interface"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFindAllMktPrograms = (query?: QueryDto<IMarketingProgram>) => {
  return useQuery({
    queryKey: ["marketing-programs", query ? JSON.stringify(query) : null],
    queryFn: () => mktProgramServices.findAll(query),
  })
}

export const useFindOptionsMktPrograms = (
  query?: QueryDto<IMarketingProgram>
) => {
  return useQuery({
    queryKey: [
      "marketing-programs",
      "options",
      query ? JSON.stringify(query) : null,
    ],
    queryFn: () => mktProgramServices.findOptions(query),
  })
}

export const useCreateMktProgram = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateMktProgramDto) =>
      mktProgramServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-programs"] })
    },
  })
}

export const useUpdateMktProgram = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({
      id,
      payload,
    }: {
      payload: UpdateMktProgramDto
      id: string
    }) => mktProgramServices.update(id, payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-programs"] })
    },
  })
}

export const useDeleteMktProgram = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (id: string) => mktProgramServices.delete(id),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-programs"] })
    },
  })
}
