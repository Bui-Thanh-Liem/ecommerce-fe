"use client"
import { DataTable } from "@/components/data-table"
import { useDeleteProduct, useFindAllProducts } from "@/hooks/apis/use-product"
import { IProduct } from "@/shared/interfaces/models/product.interface"
import { useState } from "react"
import { productColumns } from "./product-column"
import { ProductVariantAction } from "./product-variant-action"

export function ProductVariantPage() {
  const { mutateAsync, isPending } = useDeleteProduct()
  const { data } = useFindAllProducts()
  const metadataProducts = data?.metadata

  // State quản lý dialog
  const [open, setOpen] = useState(false)
  const [initialData, setInitialData] = useState<IProduct | null>(null)
  const [dataEdit, setDataEdit] = useState<IProduct | null>(null)

  // Hàm này sẽ được gọi khi dialog đóng, giúp reset dataEdit sau khi đóng dialog
  function handleClose() {
    setOpen(false)
    const id = setTimeout(() => {
      setDataEdit(null)
    }, 100)
    return () => clearTimeout(id)
  }

  //
  async function handleDeleteRow(row: IProduct) {
    const res = await mutateAsync(row.id)
    if (res?.statusCode === 200) {
      setOpen(false)
    }
  }

  if (!metadataProducts) return null
  console.log(metadataProducts)

  return (
    <>
      <DataTable
        dataSource={metadataProducts}
        columns={productColumns}
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
