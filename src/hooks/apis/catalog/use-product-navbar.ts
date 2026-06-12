import { productNavbarServices } from "@/services/catalog/product-navbar.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateProductNavbarDto,
  UpdateProductNavbarDto,
} from "@/shared/dtos/req/product-navbar.dto"
import { IProductNavbar } from "@/shared/interfaces/models/catalog/product-navbar.interface"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFindAllProductNavbars = (query?: QueryDto<IProductNavbar>) => {
  return useQuery({
    queryKey: ["product-navbars", query ? JSON.stringify(query) : null],
    queryFn: () => productNavbarServices.findAll(query),
  })
}

export const useFindOptionsProductNavbars = (
  query?: QueryDto<IProductNavbar>
) => {
  return useQuery({
    queryKey: ["product-navbars-options", query ? JSON.stringify(query) : null],
    queryFn: () => productNavbarServices.findOptions(query),
  })
}

export const useCreateProductNavbar = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateProductNavbarDto) =>
      productNavbarServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-navbars"] })
    },
  })
}

export const useUpdateProductNavbar = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({
      id,
      payload,
    }: {
      payload: UpdateProductNavbarDto
      id: string
    }) => productNavbarServices.update(id, payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-navbars"] })
    },
  })
}

export const useDeleteProductNavbar = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (id: string) => productNavbarServices.delete(id),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-navbars"] })
    },
  })
}
