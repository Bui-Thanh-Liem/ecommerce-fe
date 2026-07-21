import { QueryDto } from "@/shared/dtos/common/query.dto"
import { CreateOrderDto } from "@/shared/dtos/req/order.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { IOrder } from "@/shared/interfaces/models/customer/order.interface"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const orderService = {
  create: async (data: CreateOrderDto) => {
    const res = await apiCall<IOrder>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    })

    return handleResponse<IOrder>(res)
  },

  findAllOwned: async (query?: QueryDto) => {
    const queryParams = generateQueryParams({ params: query })

    const res = await apiCall<ResMetadataDto<IOrder>>(
      `/orders/owned?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<IOrder>>(res)
  },

  findOneOwned: async (id: string) => {
    const res = await apiCall<IOrder>(`/orders/owned/${id}`, {
      method: "GET",
    })

    return handleResponse<IOrder>(res)
  },

  changeQuantityItem: async (
    orderId: string,
    orderItemId: string,
    productId: string,
    quantity: number
  ) => {
    const res = await apiCall<IOrder>(
      `/orders/${orderId}/items/${orderItemId}/product/${productId}/quantity/${quantity}`,
      {
        method: "PATCH",
      }
    )

    return handleResponse<IOrder>(res)
  },
}
