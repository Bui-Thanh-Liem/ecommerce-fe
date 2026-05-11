"use client"

import { useState } from "react"
import { useDeleteTeam, useFindAllTeams } from "@/hooks/use-team"
import {
  LABEL_COMPANY_ROOT,
  VALUE_COMPANY_ROOT,
} from "@/shared/constants/team.constant"
import { DataTable } from "@/components/data-table"
import { teamColumns } from "./team-column"
import { ITeam } from "@/shared/interfaces/models/team.interface"
import { TeamTree } from "./team-tree"
import { TeamAction } from "./team-action"
import { StoreSelect } from "./filters/store-select"

export function TeamPage() {
  const [selectedStore, setSelectedStore] = useState(VALUE_COMPANY_ROOT)
  const [storeLabel, setStoreLabel] = useState(LABEL_COMPANY_ROOT)

  const { mutateAsync } = useDeleteTeam()
  const { data, isLoading } = useFindAllTeams({
    filters: {
      store: selectedStore === VALUE_COMPANY_ROOT ? "" : selectedStore,
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
          <TeamTree
            treeData={metaDataTeams.data}
            rootName={storeLabel}
            storeId={selectedStore}
          />
        }
      />

      <TeamAction
        open={open}
        dataEdit={dataEdit}
        onClose={handleClose}
        initialData={initialData}
      />
    </>
  )
}
