"use client"

import { useState } from "react"
import { useDeleteTeam, useFindAllTeams } from "@/hooks/use-team"
import { VALUE_COMPANY_ROOT } from "@/shared/constants/team.constant"
import { DataTable } from "@/components/data-table"
import { teamColumns } from "./team-column"
import { ITeam } from "@/shared/interfaces/models/team.interface"

export function TeamPage() {
  const [selectedStore, setSelectedStore] = useState(VALUE_COMPANY_ROOT)
  const [storeLabel, setStoreLabel] = useState("Tổng công ty")

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
        tabContent={<div></div>}
      />
    </>
  )

  // return (
  //   <div className="space-y-6">
  //     <div className="flex items-center justify-between">
  //       <div>
  //         <h1 className="text-2xl font-bold tracking-tight">Sơ đồ tổ chức</h1>
  //         <p className="text-muted-foreground text-sm">
  //           Quản lý cấu trúc nhân sự và đội ngũ
  //         </p>
  //       </div>
  //       <div className="w-75">
  //         <StoreSelect
  //           value={selectedStore}
  //           onValueChange={setSelectedStore}
  //           onLabelChange={setStoreLabel}
  //         />
  //       </div>
  //     </div>

  //     {isLoading ? (
  //       <div className="flex h-100 items-center justify-center">
  //         Đang tải dữ liệu...
  //       </div>
  //     ) : (
  //       <TeamTree
  //         treeData={teams}
  //         rootName={storeLabel}
  //         storeId={selectedStore}
  //       />
  //     )}
  //   </div>
  // )
}
