import { topBannerServices } from "@/services/store-front/top-banner.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateTopBannerDto,
  UpdateTopBannerDto,
} from "@/shared/dtos/req/top-banner.dto"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFindAllTopBanners = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["top-banners", JSON.stringify(query)],
    queryFn: () => topBannerServices.findAll(query),
  })
}

export const useFindOptionsTopBanners = ({
  query,
  enabled = true,
}: {
  query?: QueryDto
  enabled?: boolean
}) => {
  return useQuery({
    queryKey: ["top-banners-options"],
    queryFn: () => topBannerServices.findOptions(query),
    enabled,
  })
}

export const useCreateTopBanner = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateTopBannerDto) =>
      topBannerServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["top-banners"] })
      queryClient.invalidateQueries({ queryKey: ["top-banners-options"] })
    },
  })
}

export const useUpdateTopBanner = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({
      id,
      payload,
    }: {
      payload: UpdateTopBannerDto
      id: string
    }) => topBannerServices.update(id, payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["top-banners"] })
      queryClient.invalidateQueries({ queryKey: ["top-banners-options"] })
    },
  })
}

export const useDeleteTopBanner = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (id: string) => topBannerServices.delete(id),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["top-banners"] })
      queryClient.invalidateQueries({ queryKey: ["top-banners-options"] })
    },
  })
}
