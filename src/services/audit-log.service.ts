import { QueryDto } from "@/shared/dtos/common/query.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { IAuditLog } from "@/shared/interfaces/models/audit-log.interface"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const auditLogServices = {
  findAll: async (query?: QueryDto) => {
    const queryParams = generateQueryParams(query)

    const res = await apiCall<ResMetadataDto<IAuditLog>>(
      `/audit-logs?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<IAuditLog>>(res)
  },
}
