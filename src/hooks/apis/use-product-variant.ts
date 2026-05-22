import { productVariantServices } from "@/services/product-variant.service"
import {
  CreateProductVariantDto,
  UpdateProductVariantDto,
} from "@/shared/dtos/req/product-variant.dto"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useFindAllProductVariants = () => {
  return useQuery({
    queryKey: ["product-variants"],
    queryFn: productVariantServices.findAll,
  })
}

export const useCreateProductVariant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateProductVariantDto) =>
      productVariantServices.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-variants"] })
    },
  })
}

export const useUpdateProductVariant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({
      id,
      payload,
    }: {
      payload: UpdateProductVariantDto
      id: string
    }) => productVariantServices.update(id, payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-variants"] })
    },
  })
}

export const useDeleteProductVariant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (id: string) => productVariantServices.delete(id),

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
      queryClient.invalidateQueries({ queryKey: ["product-variants"] })
    },

    // 3. onError cũng nhận context tương tự nếu xảy ra lỗi
    onError: (error, variables, context) => {
      if (context?.currentToastId) {
        toast.error("Xóa thất bại rồi!", { id: context.currentToastId })
      }
    },
  })
}
