import { mainBannerServices } from "@/services/catalog/main-banner.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateMainBannerDto,
  UpdateMainBannerDto,
} from "@/shared/dtos/req/main-banner.dto"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFindAllMainBanners = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["main-banners", JSON.stringify(query)],
    queryFn: () => mainBannerServices.findAll(query),
  })
}

export const useFindOptionsMainBanners = () => {
  return useQuery({
    queryKey: ["main-banners-options"],
    queryFn: () => mainBannerServices.findOptions(),
  })
}

export const useCreateMainBanner = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateMainBannerDto) =>
      mainBannerServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["main-banners"] })
      queryClient.invalidateQueries({ queryKey: ["main-banners-options"] })
    },
  })
}

export const useUpdateMainBanner = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({
      id,
      payload,
    }: {
      payload: UpdateMainBannerDto
      id: string
    }) => mainBannerServices.update(id, payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["main-banners"] })
      queryClient.invalidateQueries({ queryKey: ["main-banners-options"] })
    },
  })
}

export const useDeleteMainBanner = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (id: string) => mainBannerServices.delete(id),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["main-banners"] })
      queryClient.invalidateQueries({ queryKey: ["main-banners-options"] })
    },
  })
}
