import { QueryDto } from "@/shared/dtos/common/query.dto"
import { CreateTeamDto } from "@/shared/dtos/req/team.dto"
import { ITeam } from "@/shared/interfaces/models/team.interface"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const teamServices = {
  create: async (payload: CreateTeamDto) => {
    const res = await apiCall<ITeam>("/teams", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<ITeam>(res)
  },

  findAll: async (query: QueryDto) => {
    const queryParams = generateQueryParams(query)

    const res = await apiCall<ITeam[]>(`/teams?${queryParams}`, {
      method: "GET",
    })

    return handleResponse<ITeam[]>(res)
  },

  findAllByStore: async (storeId: string) => {
    console.log(`Fetching teams for store: ${storeId}`)

    const res = await apiCall<ITeam[]>(`/teams/store/${storeId}`, {
      method: "GET",
    })

    return handleResponse<ITeam[]>(res)
  },
}
