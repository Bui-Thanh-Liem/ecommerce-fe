"use client"
import { DataTable } from "@/components/data-table"
import { useDeleteStore, useFindAllStores } from "@/hooks/apis/use-store"
import { IStore } from "@/shared/interfaces/models/store.interface"
import dynamic from "next/dynamic"
import { useState } from "react"
import { StoreAction } from "./store-action"
import { storeColumns } from "./store-column"

const StoreMap = dynamic(
  () => import("@/features/manager/store/store-map").then((mod) => mod.StoreMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center">
        <p>Đang tải bản đồ...</p>
      </div>
    ),
  }
)

export function StorePage() {
  const { mutateAsync } = useDeleteStore()
  const { data } = useFindAllStores()
  const metadataStores = data?.metadata

  // State quản lý dialog
  const [open, setOpen] = useState(false)
  const [initialData, setInitialData] = useState<IStore | null>(null)
  const [dataEdit, setDataEdit] = useState<IStore | null>(null)

  // Hàm này sẽ được gọi khi dialog đóng, giúp reset dataEdit sau khi đóng dialog
  function handleClose() {
    setOpen(false)
    const id = setTimeout(() => {
      setDataEdit(null)
    }, 100)
    return () => clearTimeout(id)
  }

  //
  async function handleDeleteRow(row: IStore) {
    const res = await mutateAsync(row.id)
    if (res?.statusCode === 200) {
      setOpen(false)
    }
  }

  if (!metadataStores) return null

  return (
    <>
      <DataTable
        dataSource={metadataStores}
        columns={storeColumns}
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
        tabHeader="Map"
        tabContent={
          <StoreMap
            onCreate={(store) => {
              setInitialData(store)
              setOpen(true)
            }}
            onEdit={(store) => {
              setDataEdit(store)
              setOpen(true)
            }}
            onDelete={(store) => {
              handleDeleteRow(store)
            }}
            stores={metadataStores.data}
          />
        }
      />

      <StoreAction
        open={open}
        dataEdit={dataEdit}
        onClose={handleClose}
        initialData={initialData}
      />
    </>
  )
}
