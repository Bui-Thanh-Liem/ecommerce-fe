import { CreateStoreDto } from "@/shared/dtos/req/create-store.dto"
import { IStore } from "@/shared/interfaces/models/store.interface"
import { apiCall } from "@/utils/call-api.util"
import { toast } from "sonner"

export const storeServices = {
  create: async (payload: CreateStoreDto) => {
    const res = await apiCall<IStore>("/stores", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    if (res.statusCode !== 201) {
      toast.error(res.message || "Failed to create store")
      return null
    }

    return res
  },

  findAll: async () => {
    const res = await apiCall<IStore[]>("/stores", {
      method: "GET",
    })

    console.log(res)

    return res
  },
}
