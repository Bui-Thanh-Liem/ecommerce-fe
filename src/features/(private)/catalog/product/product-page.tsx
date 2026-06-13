"use client"
import { DataTable } from "@/components/data-table"
import {
  useDeleteProduct,
  useFindAllProducts,
} from "@/hooks/apis/catalog/use-product"
import { IProduct } from "@/shared/interfaces/models/catalog/product.interface"
import { useState } from "react"
import { productColumns } from "./product-column"
import { ProductAction } from "./product-action"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export function ProductPage() {
  const router = useRouter()

  const { mutateAsync, isPending } = useDeleteProduct()
  const { data } = useFindAllProducts()
  const metadataProducts = data?.metadata

  // State quản lý dialog
  const [open, setOpen] = useState(false)
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

  //
  function handleCreateVariant(product: IProduct) {
    router.push(`/catalog/product-variants?p=${product.id}`)
  }

  if (!metadataProducts) return null

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
        extraAction={(row) => {
          return (
            <>
              <DropdownMenuItem
                onClick={() => handleCreateVariant(row.original)}
              >
                Create Variant
              </DropdownMenuItem>
            </>
          )
        }}
      />

      <ProductAction open={open} onClose={handleClose} dataEdit={dataEdit} />
    </>
  )
}
