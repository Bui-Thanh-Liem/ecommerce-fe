import { CreateStoreDto } from "@/shared/dtos/req/create-store.dto"
import { IStore } from "@/shared/interfaces/models/store.interface"
import { apiCall } from "@/utils/call-api.util"
import { handleResponse } from "@/utils/handle-response.util"

export const storeServices = {
  create: async (payload: CreateStoreDto) => {
    const res = await apiCall<IStore>("/stores", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<IStore>(res)
  },

  findAll: async () => {
    const res = await apiCall<IStore[]>("/stores", {
      method: "GET",
    })

    return handleResponse<IStore[]>(res)
  },
}
