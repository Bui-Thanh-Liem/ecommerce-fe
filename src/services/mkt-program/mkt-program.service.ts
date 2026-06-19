import { QueryDto } from "@/shared/dtos/common/query.dto"
import {
  CreateMktProgramDto,
  UpdateMktProgramDto,
} from "@/shared/dtos/req/mkt-program.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { IMarketingProgram } from "@/shared/interfaces/models/mkt-program/marketing-program.interface"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const mktProgramServices = {
  create: async (payload: CreateMktProgramDto) => {
    const res = await apiCall<IMarketingProgram>("/marketing-programs", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse<IMarketingProgram>(res)
  },

  findAll: async (query?: QueryDto<IMarketingProgram>) => {
    const queryParams = generateQueryParams({ params: query })

    const res = await apiCall<ResMetadataDto<IMarketingProgram>>(
      `/marketing-programs?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<IMarketingProgram>>(res)
  },

  findOptions: async (query?: QueryDto<IMarketingProgram>) => {
    const queryParams = generateQueryParams({ params: query, isOption: true })

    const res = await apiCall<ResMetadataDto<IMarketingProgram>>(
      `/marketing-programs/options?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<IMarketingProgram>>(res)
  },

  update: async (id: string, payload: UpdateMktProgramDto) => {
    const res = await apiCall<IMarketingProgram>(`/marketing-programs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse<IMarketingProgram>(res)
  },

  delete: async (id: string) => {
    const res = await apiCall(`/marketing-programs/${id}`, {
      method: "DELETE",
    })

    return handleResponse(res)
  },
}
