"use client"
import { DataTable } from "@/components/data-table"
import {
  useDeleteInventory,
  useFindAllInventories,
} from "@/hooks/apis/use-inventory"
import { inventoryColumns } from "./inventory-column"
import { useState } from "react"
import { IInventory } from "@/shared/interfaces/models/inventory.interface"
import { InventoryAction } from "./inventory-action"
import { useRouter, useSearchParams } from "next/navigation"

export function InventoryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productVariantId = searchParams.get("pv")

  const { mutateAsync, isPending } = useDeleteInventory()
  const { data } = useFindAllInventories()
  const metadataInventories = data?.metadata

  // State quản lý dialog
  const [open, setOpen] = useState(false)
  const [dataEdit, setDataEdit] = useState<IInventory | null>(null)

  //
  function handleClose() {
    if (productVariantId) router.push("/inventories") // Xóa query parameter khi đóng dialog

    setOpen(false)
    const id = setTimeout(() => {
      setDataEdit(null)
    }, 100)

    return () => clearTimeout(id)
  }

  //
  async function handleDeleteRow(row: IInventory) {
    const res = await mutateAsync(row.id)
    if (res?.statusCode === 200) {
      setOpen(false)
    }
  }

  //
  const initialData = productVariantId
    ? ({ productVariant: { id: productVariantId } } as IInventory)
    : null
  const dialogOpen = open || !!productVariantId

  if (!metadataInventories) return null

  return (
    <>
      <DataTable
        dataSource={metadataInventories}
        columns={inventoryColumns}
        //
        onAddRow={() => setOpen(true)}
        onEditRow={(row) => {
          setOpen(true)
          setDataEdit(row.original)
        }}
        onDeleteRow={(row) => {
          handleDeleteRow(row.original)
        }}
        isPending={isPending}
      />

      <InventoryAction
        open={dialogOpen}
        dataEdit={dataEdit}
        onClose={handleClose}
        initialData={initialData}
      />
    </>
  )
}
