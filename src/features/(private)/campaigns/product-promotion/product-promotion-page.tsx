"use client"

import {
  useDeleteProductPromotion,
  useFindAllProductPromotions,
} from "@/hooks/apis/use-product-promotion"
import { IProductPromotion } from "@/shared/interfaces/models/product-promotion.interface"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { productPromotionColumns } from "./product-promotion-column"
import { DataTable } from "@/components/data-table"
import { ProductPromotionAction } from "./product-promotion-action"

export function ProductPromotionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const promotionId = searchParams.get("p")

  const { mutateAsync, isPending } = useDeleteProductPromotion()
  const { data } = useFindAllProductPromotions()
  const metadataProdPromotions = data?.metadata

  //
  const [open, setOpen] = useState(false)
  const [dataEdit, setDataEdit] = useState<IProductPromotion | null>(null)

  //
  function handleClose() {
    if (promotionId) router.push("/category-promotions")
    setOpen(false)
    const id = setTimeout(() => {
      setDataEdit(null)
    }, 100)

    return () => clearTimeout(id)
  }

  //
  async function handleDeleteRow(row: IProductPromotion) {
    const res = await mutateAsync(row.id)
    if (res?.statusCode === 200) {
      setOpen(false)
    }
  }

  //
  const initialData = promotionId
    ? ({ promotion: { id: promotionId } } as IProductPromotion)
    : null
  const dialogOpen = open || !!promotionId

  //
  if (!metadataProdPromotions) return null
  console.log("metadataProdPromotions :>> ", metadataProdPromotions)

  return (
    <>
      <DataTable
        dataSource={metadataProdPromotions}
        columns={productPromotionColumns}
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

      {dialogOpen && (
        <ProductPromotionAction
          open={dialogOpen}
          dataEdit={dataEdit}
          onClose={handleClose}
          initialData={initialData}
        />
      )}
    </>
  )
}
