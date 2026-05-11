"use client"

import { useState } from "react"
import { DataTable } from "@/components/data-table"
import {
  useDeleteTeamCategory,
  useFindAllTeamCategories,
} from "@/hooks/use-team-category"
import { teamCategoryColumns } from "./team-category-column"
import { ITeamCategory } from "@/shared/interfaces/models/team-category.interface"

export function TeamCategoryPage() {
  const { mutateAsync } = useDeleteTeamCategory()
  const { data, isLoading } = useFindAllTeamCategories({
    page: 1,
    limit: 100,
    filters: {},
  })
  const metaDataTeamCategories = data?.metadata

  // State quản lý dialog
  const [open, setOpen] = useState(false)
  const [initialData, setInitialData] = useState<ITeamCategory | null>(null)
  const [dataEdit, setDataEdit] = useState<ITeamCategory | null>(null)

  // Hàm này sẽ được gọi khi dialog đóng, giúp reset dataEdit sau khi đóng dialog
  function handleClose() {
    setOpen(false)
    const id = setTimeout(() => {
      setDataEdit(null)
    }, 100)
    return () => clearTimeout(id)
  }

  //
  async function handleDeleteRow(row: ITeamCategory) {
    const res = await mutateAsync(row.id)
    if (res?.statusCode === 200) {
      setOpen(false)
    }
  }

  if (!metaDataTeamCategories) return null

  return (
    <>
      <DataTable
        dataSource={metaDataTeamCategories}
        columns={teamCategoryColumns}
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
        tabContent={<></>}
      />
    </>
  )
}
