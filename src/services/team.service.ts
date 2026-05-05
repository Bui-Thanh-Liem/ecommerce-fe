import { CreateStoreDto } from "@/shared/dtos/req/create-store.dto"
import { ITeam } from "@/shared/interfaces/models/team.interface"
import { apiCall } from "@/utils/call-api.util"
import { handleResponse } from "@/utils/handle-response.util"

export const teamServices = {
  create: async (payload: CreateStoreDto) => {
    const res = await apiCall<ITeam>("/teams", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<ITeam>(res)
  },

  findAll: async (query?: { storeId?: string }) => {
    const queryParams = new URLSearchParams()

    const validUUID = (str: string) => {
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      return uuidRegex.test(str)
    }

    if (query?.storeId && validUUID(query.storeId)) {
      queryParams.append("store", query.storeId)
    }

    const res = await apiCall<ITeam[]>(`/teams?${queryParams.toString()}`, {
      method: "GET",
    })

    return handleResponse<ITeam[]>(res)
  },
}
