"use client"
import { DataTable } from "@/components/data-table"
import { useState } from "react"
import { productVariantColumns } from "./product-variant-column"
import { ProductVariantAction } from "./product-variant-action"
import { IProductVariant } from "@/shared/interfaces/models/product-variant.interface"
import {
  useDeleteProductVariant,
  useFindAllProductVariants,
} from "@/hooks/apis/use-product-variant"

export function ProductVariantPage() {
  const { mutateAsync, isPending } = useDeleteProductVariant()
  const { data } = useFindAllProductVariants()
  const metadataProducts = data?.metadata

  // State quản lý dialog
  const [open, setOpen] = useState(false)
  const [dataEdit, setDataEdit] = useState<IProductVariant | null>(null)

  // Hàm này sẽ được gọi khi dialog đóng, giúp reset dataEdit sau khi đóng dialog
  function handleClose() {
    setOpen(false)
    const id = setTimeout(() => {
      setDataEdit(null)
    }, 100)
    return () => clearTimeout(id)
  }

  //
  async function handleDeleteRow(row: IProductVariant) {
    const res = await mutateAsync(row.id)
    if (res?.statusCode === 200) {
      setOpen(false)
    }
  }

  if (!metadataProducts) return null

  console.log("metadataProducts :::", metadataProducts)

  return (
    <>
      <DataTable
        dataSource={metadataProducts}
        columns={productVariantColumns}
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

      <ProductVariantAction
        open={open}
        onClose={handleClose}
        dataEdit={dataEdit}
      />
    </>
  )
}
