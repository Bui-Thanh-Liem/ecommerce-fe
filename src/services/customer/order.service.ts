import { IOrder } from "@/shared/interfaces/models/customer/order.interface"
import { apiCall } from "@/utils/call-api.util"
import { handleResponse } from "@/utils/handle-response.util"

export const orderService = {
  create: async (data: any) => {
    const res = await apiCall<IOrder>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    })

    return handleResponse<IOrder>(res)
  },
}
