import { QueryDto } from "@/shared/dtos/common/query.dto"
import { CreateStoreDto, UpdateStoreDto } from "@/shared/dtos/req/store.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { IStore } from "@/shared/interfaces/models/inventory/store.interface"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const storeServices = {
  create: async (payload: CreateStoreDto) => {
    const res = await apiCall<IStore>("/stores", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<IStore>(res)
  },

  update: async (id: string, payload: UpdateStoreDto) => {
    const res = await apiCall<IStore>(`/stores/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse<IStore>(res)
  },

  findOptions: async (query?: QueryDto) => {
    const queryParams = generateQueryParams({ params: query, isOption: true })

    const res = await apiCall<ResMetadataDto<IStore>>(
      `/stores/options?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<IStore>>(res)
  },

  findAll: async (query?: QueryDto) => {
    const queryParams = generateQueryParams({ params: query })

    const res = await apiCall<ResMetadataDto<IStore>>(
      `/stores?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<IStore>>(res)
  },

  delete: async (id: string) => {
    const res = await apiCall(`/stores/${id}`, {
      method: "DELETE",
    })

    return handleResponse(res)
  },
}
