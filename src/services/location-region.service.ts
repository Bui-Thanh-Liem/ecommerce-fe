import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateLocationRegionDto,
  UpdateLocationRegionDto,
} from "@/shared/dtos/req/location-region.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { LocationRegionType } from "@/shared/enums/location-region-type.enum"
import { ILocationRegion } from "@/shared/interfaces/models/location-region.interface"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const locationRegionServices = {
  create: async (payload: CreateLocationRegionDto) => {
    const res = await apiCall<ILocationRegion>("/location-regions", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<ILocationRegion>(res)
  },

  update: async (id: string, payload: UpdateLocationRegionDto) => {
    const res = await apiCall<ILocationRegion>(`/location-regions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse<ILocationRegion>(res)
  },

  findAll: async (query?: QueryDto) => {
    const queryParams = generateQueryParams(query)

    const res = await apiCall<ResMetadataDto<ILocationRegion>>(
      `/location-regions?${queryParams.toString()}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<ILocationRegion>>(res)
  },

  getTreeData: async (query?: QueryDto) => {
    const queryParams = generateQueryParams(query)

    const res = await apiCall<ILocationRegion[]>(
      `/location-regions/tree?${queryParams.toString()}`,
      {
        method: "GET",
      }
    )
    return handleResponse<ILocationRegion[]>(res)
  },

  getRegions: async (type: LocationRegionType, parentId?: string) => {
    const queryParams = new URLSearchParams()

    queryParams.append("type", type)
    if (parentId) queryParams.append("parentId", parentId)

    const res = await apiCall<ILocationRegion[]>(
      `/location-regions/regions?${queryParams.toString()}`,
      {
        method: "GET",
      }
    )
    return handleResponse<ILocationRegion[]>(res)
  },

  delete: async (id: string) => {
    const res = await apiCall(`/location-regions/${id}`, {
      method: "DELETE",
    })

    return handleResponse(res)
  },
}
