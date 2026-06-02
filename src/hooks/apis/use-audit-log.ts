import { auditLogServices } from "@/services/audit-log.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import { useQuery } from "@tanstack/react-query"

export const useFindAllAuditLogs = (query?: QueryDto) => {
  return useQuery({
    queryKey: ["audit-logs", JSON.stringify(query)],
    queryFn: () => auditLogServices.findAll(query),
  })
}
