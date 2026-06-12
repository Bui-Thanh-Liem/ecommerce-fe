"use client"

import { DataTable } from "@/components/data-table"
import { useFindAllAuditLogs } from "@/hooks/apis/management/use-audit-log"
import { auditLogColumns } from "./audit-log-column"
import { useUrlParams } from "@/hooks/use-url-params"

export function AuditLogPage() {
  const { params, setParams } = useUrlParams({ page: 1, limit: 10 })
  //

  //
  const { data, refetch } = useFindAllAuditLogs(params)
  const metaDataAuditLogs = data?.metadata

  if (!metaDataAuditLogs) return null

  return (
    <DataTable
      dataSource={metaDataAuditLogs}
      columns={auditLogColumns}
      onRefetch={refetch}
      onPaginationChange={(paginationState) => {
        setParams({
          page: paginationState.pageIndex + 1,
          limit: paginationState.pageSize,
        })
      }}
    />
  )
}
