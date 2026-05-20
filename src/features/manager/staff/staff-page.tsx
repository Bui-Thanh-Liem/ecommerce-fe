"use client"

import { DataTable } from "@/components/data-table"
import { useDeleteStaff, useFindAllStaffs } from "@/hooks/apis/use-staff"
import { staffColumns } from "./staff-column"
import { StaffAction } from "./staff-action"
import { useState } from "react"
import { IStaff } from "@/shared/interfaces/models/staff.interface"
import { StaffHierarchy } from "./staff-hierarchy"

export function StaffPage() {
  const { mutateAsync } = useDeleteStaff()
  const { data } = useFindAllStaffs()
  const meteDataStaffs = data?.metadata

  // State quản lý dialog
  const [open, setOpen] = useState(false)
  const [initialData, setInitialData] = useState<IStaff | null>(null)
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

  if (!meteDataStaffs) return null

  return (
    <>
      <DataTable
        dataSource={meteDataStaffs}
        columns={staffColumns}
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
        tabHeader="Hierarchy"
        tabContent={
          <StaffHierarchy
            dataSource={meteDataStaffs}
            onCreate={(staff) => {
              setOpen(true)
              setInitialData(staff)
            }}
            onEdit={(staff) => {
              setOpen(true)
              setDataEdit(staff)
            }}
            onDelete={(staff) => handleDeleteRow(staff)}
          />
        }
        getRowClassName={(item) => {
          if (item.isSuperAdmin) return "bg-orange-100 hover:bg-orange-50"
          if (item.isSubAdmin) return "bg-yellow-100 hover:bg-yellow-50"
          if (item.isStoreAdmin) return "bg-emerald-100 hover:bg-emerald-50"
          return ""
        }}
      />

      <StaffAction
        open={open}
        dataEdit={dataEdit}
        onClose={handleClose}
        initialData={initialData}
      />
    </>
  )
}
