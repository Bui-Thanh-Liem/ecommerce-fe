import { CreateLocationRegionDto } from "@/shared/dtos/req/create-location-region.dto"
import { ILocationRegion } from "@/shared/interfaces/models/location-region.interface"
import { apiCall } from "@/utils/call-api.util"
import { handleResponse } from "@/utils/handle-response.util"

export const locationRegionServices = {
  create: async (payload: CreateLocationRegionDto) => {
    const res = await apiCall<ILocationRegion>("/location-regions", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<ILocationRegion>(res)
  },

  findAll: async () => {
    const res = await apiCall<ILocationRegion[]>("/location-regions", {
      method: "GET",
    })

    return handleResponse<ILocationRegion[]>(res)
  },

  getTreeDataByRootId: async (id: string) => {
    const res = await apiCall<ILocationRegion[]>(
      `/location-regions/tree/${id}`,
      {
        method: "GET",
      }
    )
    return handleResponse<ILocationRegion[]>(res)
  },
}
