import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateInventoryDto,
  UpdateInventoryDto,
} from "@/shared/dtos/req/inventory.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { IInventory } from "@/shared/interfaces/models/inventory/inventory.interface"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const inventoryServices = {
  create: async (payload: CreateInventoryDto) => {
    const res = await apiCall("/inventories", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse(res)
  },

  findAll: async (query?: QueryDto) => {
    const queryParams = generateQueryParams({ params: query })

    const res = await apiCall<ResMetadataDto<IInventory>>(
      `/inventories?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<IInventory>>(res)
  },

  findOptions: async (query?: QueryDto) => {
    const queryParams = generateQueryParams({ params: query, isOption: true })

    const res = await apiCall<ResMetadataDto<IInventory>>(
      `/inventories/options?${queryParams}`,
      {
        method: "GET",
      }
    )

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
