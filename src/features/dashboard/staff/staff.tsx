"use client"

import { DataTable } from "@/components/data-table"
import { useFindAllStaffs } from "@/hooks/use-staff"
import { columns } from "./staff.column"
import { StaffAddForm } from "./staff-add-form"

export function StaffPage() {
  const { data } = useFindAllStaffs()
  const staffs = data?.metadata || []

  return (
    <DataTable columns={columns} data={staffs} actionForm={<StaffAddForm />} />
  )
}
