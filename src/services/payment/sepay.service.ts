import { CreateCheckoutDto } from "@/shared/dtos/req/sepay.dto"
import { IResponseCheckout } from "@/shared/dtos/res/sepay.interface"
import { apiCall } from "@/utils/call-api.util"
import { handleResponse } from "@/utils/handle-response.util"

export const sepayService = {
  checkout: async (payload: CreateCheckoutDto) => {
    const res = await apiCall<IResponseCheckout>("/sepay/checkout", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<IResponseCheckout>(res)
  },
}
