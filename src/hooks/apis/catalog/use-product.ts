import { productServices } from "@/services/catalog/product.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateProductDto,
  UpdateProductDto,
} from "@/shared/dtos/req/product.dto"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useFindAllProducts = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => productServices.findAll(query),
  })
}

export const useFindOptionsProducts = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["products", "options"],
    queryFn: () => productServices.findOptions(query),
  })
}

export const useFindProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["products", slug],
    queryFn: () => productServices.findOneBySlug(slug),

    enabled: !!slug, // Chỉ chạy query khi slug tồn tại
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateProductDto) => productServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({ id, payload }: { payload: UpdateProductDto; id: string }) =>
      productServices.update(id, payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (id: string) => productServices.delete(id),

    // 1. onMutate chạy trước, tạo toast loading và RETURN về id của toast đó
    onMutate: async () => {
      const id = toast.loading("Đang xóa sản phẩm...")

      // Bất kỳ thứ gì bạn return ở đây sẽ được chuyển vào tham số 'context' phía dưới
      return { currentToastId: id }
    },

    // 2. onSuccess nhận context (tham số thứ 3) chứa currentToastId
    onSuccess: (data, variables, context) => {
      if (context?.currentToastId) {
        toast.success("Xóa thành công!", { id: context.currentToastId })
      }
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },

    // 3. onError cũng nhận context tương tự nếu xảy ra lỗi
    onError: (error, variables, context) => {
      if (context?.currentToastId) {
        toast.error("Xóa thất bại rồi!", { id: context.currentToastId })
      }
    },
  })
}
