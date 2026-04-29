import { CreateLocationRegionDto } from "@/shared/dtos/req/create-location-region.dto"
import { ILocationRegion } from "@/shared/interfaces/models/location-region.interface"
import { apiCall } from "@/utils/call-api.util"
import { toast } from "sonner"

export const locationRegionServices = {
  create: async (payload: CreateLocationRegionDto) => {
    const res = await apiCall<ILocationRegion>("/location-regions", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    if (res.statusCode !== 201) {
      toast.error(res.message || "Failed to create location region")
      return null
    }

    return res
  },

  findAll: async () => {
    const res = await apiCall<ILocationRegion[]>("/location-regions", {
      method: "GET",
    })

    return res
  },

  getTreeDataByRootId: async (id: string) => {
    const res = await apiCall<ILocationRegion[]>(
      `/location-regions/tree/${id}`,
      {
        method: "GET",
      }
    )

    return res
  },
}
