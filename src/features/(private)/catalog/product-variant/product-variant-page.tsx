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
import { useRouter, useSearchParams } from "next/navigation"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

export function ProductVariantPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get("p") // Lấy productId từ query parameter

  const { mutateAsync, isPending } = useDeleteProductVariant()
  const { data } = useFindAllProductVariants()
  const metadataProductVariants = data?.metadata

  // State quản lý dialog
  const [open, setOpen] = useState(false)
  const [dataEdit, setDataEdit] = useState<IProductVariant | null>(null)

  // Hàm này sẽ được gọi khi dialog đóng, giúp reset dataEdit sau khi đóng dialog
  function handleClose() {
    if (productId) router.push("/product-variants") // Xóa query parameter khi đóng dialog
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

  //
  const initialData = productId
    ? ({ product: { id: productId } } as IProductVariant)
    : null
  const dialogOpen = open || !!productId

  //
  function handleCreateInventory(product: IProductVariant) {
    router.push(`/inventories?pv=${product.id}`)
  }

  //
  if (!metadataProductVariants) return null

  return (
    <>
      <DataTable
        dataSource={metadataProductVariants}
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
        extraAction={(row) => {
          return (
            <>
              <DropdownMenuItem
                onClick={() => handleCreateInventory(row.original)}
              >
                Create Inventory
              </DropdownMenuItem>
            </>
          )
        }}
      />

      <ProductVariantAction
        open={dialogOpen}
        dataEdit={dataEdit}
        onClose={handleClose}
        initialData={initialData}
      />
    </>
  )
}
