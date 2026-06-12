import { campaignServices } from "@/services/mkt-program/campaign.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateCampaignDto,
  UpdateCampaignDto,
} from "@/shared/dtos/req/campaign.dto"
import { ICampaign } from "@/shared/interfaces/models/mkt-program/campaign.interface"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFindAllCampaigns = (query?: QueryDto<ICampaign>) => {
  return useQuery({
    queryKey: ["campaigns", query ? JSON.stringify(query) : null],
    queryFn: () => campaignServices.findAll(query),
  })
}

export const useFindOptionsCampaigns = (query?: QueryDto<ICampaign>) => {
  return useQuery({
    queryKey: ["campaigns", "options", query ? JSON.stringify(query) : null],
    queryFn: () => campaignServices.findOptions(query),
  })
}

export const useCreateCampaign = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateCampaignDto) =>
      campaignServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] })
    },
  })
}

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({ id, payload }: { payload: UpdateCampaignDto; id: string }) =>
      campaignServices.update(id, payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] })
    },
  })
}

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (id: string) => campaignServices.delete(id),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] })
    },
  })
}
