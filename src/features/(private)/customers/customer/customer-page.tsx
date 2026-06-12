"use client"

import { DataTable } from "@/components/data-table"
import { useFindAllCustomers } from "@/hooks/apis/customer/use-customer"
import { useUrlParams } from "@/hooks/use-url-params"
import { customerColumns } from "./customer-column"

export function CustomerPage() {
  const { params, setParams } = useUrlParams({ page: 1, limit: 10 })
  const { data } = useFindAllCustomers(params)
  const metaDataCustomers = data?.metadata

  if (!metaDataCustomers) return null

  return (
    <DataTable
      dataSource={metaDataCustomers}
      columns={customerColumns}
      onPaginationChange={(paginationState) => {
        setParams({
          page: paginationState.pageIndex + 1,
          limit: paginationState.pageSize,
        })
      }}
    />
  )
}
