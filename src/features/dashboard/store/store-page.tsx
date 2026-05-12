"use client"
import { useDeleteStore, useFindAllStores } from "@/hooks/use-store"
import { DataTable } from "@/components/data-table"
import { storeColumns } from "./store-column"
import { useState } from "react"
import { IStore } from "@/shared/interfaces/models/store.interface"
import { StoreAction } from "./store-action"
import { StoreMap } from "./store-map"

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
