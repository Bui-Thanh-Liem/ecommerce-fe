"use client"

import { DataTable } from "@/components/data-table"
import { useFilters } from "@/hooks/use-filters"
import { useDeleteTeam, useFindAllTeams } from "@/hooks/use-team"
import { VALUE_HEADQUARTER } from "@/shared/constants/team.constant"
import { ITeam } from "@/shared/interfaces/models/team.interface"
import { useState } from "react"
import { StoreSelect } from "./filters/store-select"
import { TeamAction } from "./team-action"
import { teamColumns } from "./team-column"
import { TeamHierarchy } from "./team-hierarchy"

export function TeamPage() {
  const { filters } = useFilters()
  const safeFilters = filters as { store: string }
  const storeId = safeFilters.store || VALUE_HEADQUARTER

  const { mutateAsync } = useDeleteTeam()
  const { data } = useFindAllTeams({
    filters: {
      store: storeId === VALUE_HEADQUARTER ? "" : storeId,
    },
  })
  const metaDataTeams = data?.metadata

  // State quản lý dialog
  const [open, setOpen] = useState(false)
  const [initialData, setInitialData] = useState<ITeam | null>(null)
  const [dataEdit, setDataEdit] = useState<ITeam | null>(null)

  // Hàm này sẽ được gọi khi dialog đóng, giúp reset dataEdit sau khi đóng dialog
  function handleClose() {
    setOpen(false)
    const id = setTimeout(() => {
      setDataEdit(null)
    }, 100)
    return () => clearTimeout(id)
  }

  //
  async function handleDeleteRow(row: ITeam) {
    const res = await mutateAsync(row.id)
    if (res?.statusCode === 200) {
      setOpen(false)
    }
  }

  if (!metaDataTeams) return null

  return (
    <>
      <DataTable
        dataSource={metaDataTeams}
        columns={teamColumns}
        filters={<StoreSelect />}
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
          <TeamHierarchy treeData={metaDataTeams.data} storeId={storeId} />
        }
      />

      <TeamAction
        open={open}
        dataEdit={dataEdit}
        selectedParent={null}
        onClose={handleClose}
        initialData={initialData}
      />
    </>
  )
}
