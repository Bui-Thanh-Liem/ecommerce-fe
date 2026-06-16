import {
  CreateStoreFrontConfigDto,
  UpdateStoreFrontConfigDto,
} from "@/shared/dtos/req/store-front-config.dto"
import { IStoreFrontConfig } from "@/shared/interfaces/models/store-front/store-front-config.interface"
import { apiCall } from "@/utils/call-api.util"
import { handleResponse } from "@/utils/handle-response.util"

export const storeFrontConfigServices = {
  create: async (payload: CreateStoreFrontConfigDto) => {
    const res = await apiCall<IStoreFrontConfig>("/store-front-configs", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<IStoreFrontConfig>(res)
  },

  findConfig: async () => {
    const res = await apiCall<IStoreFrontConfig>(`/store-front-configs`, {
      method: "GET",
    })

    return handleResponse<IStoreFrontConfig>(res)
  },

  update: async (id: string, payload: UpdateStoreFrontConfigDto) => {
    const res = await apiCall(`/store-front-configs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse(res)
  },
}
