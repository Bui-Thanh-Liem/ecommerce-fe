import { orderService } from "@/services/customer/order.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  ChangeQuantityItemOrderDto,
  CreateOrderDto,
} from "@/shared/dtos/req/order.dto"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: CreateOrderDto) => orderService.create(payload),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })
}

export const useFindAllOwnedOrders = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["orders-owned"],
    queryFn: () => orderService.findAllOwned(query),
  })
}

export const useFindOneOwnedOrder = (id: string) => {
  return useQuery({
    queryKey: ["orders-owned", id],
    queryFn: () => orderService.findOneOwned(id),
  })
}

export const useChangeQuantityItemOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: (payload: ChangeQuantityItemOrderDto) =>
      orderService.changeQuantityItem(
        payload.orderId,
        payload.orderItemId,
        payload.productId,
        payload.quantity
      ),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })
}
