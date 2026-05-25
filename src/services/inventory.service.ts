import {
  CreateInventoryDto,
  UpdateInventoryDto,
} from "@/shared/dtos/req/inventory.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { IInventory } from "@/shared/interfaces/models/inventory.interface"
import { apiCall } from "@/utils/call-api.util"
import { handleResponse } from "@/utils/handle-response.util"

export const inventoryServices = {
  create: async (payload: CreateInventoryDto) => {
    const res = await apiCall("/inventories", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse(res)
  },

  findAll: async () => {
    const res = await apiCall<ResMetadataDto<IInventory>>("/inventories", {
      method: "GET",
    })

    return handleResponse<ResMetadataDto<IInventory>>(res)
  },

  update: async (id: string, payload: UpdateInventoryDto) => {
    const res = await apiCall(`/inventories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse(res)
  },

  delete: async (id: string) => {
    const res = await apiCall(`/inventories/${id}`, {
      method: "DELETE",
    })

    return handleResponse(res)
  },
}
