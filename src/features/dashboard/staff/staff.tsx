"use client"

import { DataTable } from "@/components/data-table"
import { useDeleteStaff, useFindAllStaffs } from "@/hooks/use-staff"
import { columns } from "./staff.column"
import { StaffAction } from "./staff-action"
import { useState } from "react"
import { IStaff } from "@/shared/interfaces/models/staff.interface"

export function StaffPage() {
  const { mutateAsync } = useDeleteStaff()
  const { data } = useFindAllStaffs()
  const staffs = data?.metadata || []

  // State quản lý dialog
  const [open, setOpen] = useState(false)
  const [dataEdit, setDataEdit] = useState<IStaff | null>(null)

  // Hàm này sẽ được gọi khi dialog đóng, giúp reset dataEdit sau khi đóng dialog
  function handleClose() {
    setOpen(false)
    const id = setTimeout(() => {
      setDataEdit(null)
    }, 100)
    return () => clearTimeout(id)
  }

  //
  async function handleDeleteRow(row: IStaff) {
    const res = await mutateAsync(row.id)
    if (res?.statusCode === 200) {
      setOpen(false)
    }
  }

  return (
    <>
      <DataTable
        data={staffs}
        columns={columns}
        //
        onAddRow={() => setOpen(true)}
        onEditRow={(row) => {
          setOpen(true)
          setDataEdit(row.original)
        }}
        onDeleteRow={(row) => {
          handleDeleteRow(row.original)
        }}
        //
        tabHeader="Sơ đồ"
        tabContent={<div>Sơ đồ nhân viên</div>}
      />

      <StaffAction open={open} dataEdit={dataEdit} onClose={handleClose} />
    </>
  )
}
