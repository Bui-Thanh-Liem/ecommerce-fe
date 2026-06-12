"use client"

import { DataTable } from "@/components/data-table"
import {
  useDeleteProductItem,
  useFindAllProductItems,
} from "@/hooks/apis/catalog/use-product-item"
import { productItemColumns } from "./product-item-column"
import { IProductItem } from "@/shared/interfaces/models/catalog/product-item.interface"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ProductItemAction } from "./product-item-action"

export function ProductItemPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productVariantId = searchParams.get("pv")

  const { mutateAsync, isPending } = useDeleteProductItem()
  const { data } = useFindAllProductItems()
  const metadataProductItems = data?.metadata

  // State quản lý dialog
  const [open, setOpen] = useState(false)
  const [dataEdit, setDataEdit] = useState<IProductItem | null>(null)

  //
  function handleClose() {
    if (productVariantId) router.push("/product-items") // Xóa query parameter khi đóng dialog
    setOpen(false)
    const id = setTimeout(() => {
      setDataEdit(null)
    }, 100)

    return () => clearTimeout(id)
  }

  //
  async function handleDeleteRow(row: IProductItem) {
    const res = await mutateAsync(row.id)
    if (res?.statusCode === 200) {
      setOpen(false)
    }
  }

  //
  const initialData = productVariantId
    ? ({ productVariant: { id: productVariantId } } as IProductItem)
    : null
  const dialogOpen = open || !!productVariantId

  if (!metadataProductItems) return null

  return (
    <>
      <DataTable
        dataSource={metadataProductItems}
        columns={productItemColumns}
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

      <ProductItemAction
        open={dialogOpen}
        dataEdit={dataEdit}
        onClose={handleClose}
        initialData={initialData}
      />
    </>
  )
}
